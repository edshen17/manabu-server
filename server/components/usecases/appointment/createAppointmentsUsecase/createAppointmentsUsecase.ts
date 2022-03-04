import { ObjectId } from 'mongoose';
import { IS_PRODUCTION } from '../../../../constants';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AppointmentDbServiceResponse } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import {
  AppointmentEntity,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse,
} from '../../../entities/appointment/appointmentEntity';
import { USER_ENTITY_EMAIL_ALERT } from '../../../entities/user/userEntity';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import {
  EmailHandler,
  EMAIL_HANDLER_SENDER_ADDRESS,
  EMAIL_HANDLER_TEMPLATE,
} from '../../utils/emailHandler/emailHandler';
import { SplitAvailableTimeHandler } from '../../utils/splitAvailableTimeHandler/splitAvailableTimeHandler';

type OptionalCreateAppointmentsUsecaseInitParams = {
  makeAppointmentEntity: Promise<AppointmentEntity>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
  makeSplitAvailableTimeHandler: Promise<SplitAvailableTimeHandler>;
  makeEmailHandler: Promise<EmailHandler>;
  dayjs: any;
};

type CreateAppointmentsUsecaseResponse = {
  appointments: AppointmentDoc[];
  packageTransaction: PackageTransactionDoc;
};

class CreateAppointmentsUsecase extends AbstractCreateUsecase<
  OptionalCreateAppointmentsUsecaseInitParams,
  CreateAppointmentsUsecaseResponse,
  AppointmentDbServiceResponse
> {
  private _appointmentEntity!: AppointmentEntity;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _availableTimeDbService!: AvailableTimeDbService;
  private _splitAvailableTimeHandler!: SplitAvailableTimeHandler;
  private _dayjs!: any;
  private _emailHandler!: EmailHandler;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateAppointmentsUsecaseResponse> => {
    const { body, dbServiceAccessOptions, currentAPIUser } = props;
    const { appointments, packageTransaction } = await this._createAppointments({
      appointments: body.appointments,
      dbServiceAccessOptions,
      currentAPIUser,
    });
    this._sendTeacherAppointmentCreationEmail(appointments);
    const usecaseRes = {
      appointments,
      packageTransaction,
    };
    return usecaseRes;
  };

  private _createAppointments = async (props: {
    appointments: AppointmentEntityBuildParams[];
    dbServiceAccessOptions: DbServiceAccessOptions;
    currentAPIUser: CurrentAPIUser;
  }): Promise<CreateAppointmentsUsecaseResponse> => {
    const { appointments, dbServiceAccessOptions } = props;
    const modelToInsert: AppointmentEntityBuildResponse[] = [];
    // all go through or none go through
    for (const appointment of appointments) {
      await this._createAppointment({ ...props, appointment, modelToInsert });
    }
    this._testSameAppointmentType(modelToInsert);
    const savedDbAppointments = await this._dbService.insertMany({
      modelToInsert,
      dbServiceAccessOptions,
    });
    const packageTransaction = await this._decrementAppointmentCount(savedDbAppointments);
    await this._splitAvailableTimeBrancher(savedDbAppointments);
    return { appointments: savedDbAppointments, packageTransaction };
  };

  private _createAppointment = async (props: {
    appointment: AppointmentEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
    currentAPIUser: CurrentAPIUser;
    modelToInsert: AppointmentEntityBuildResponse[];
  }): Promise<void> => {
    const { appointment, dbServiceAccessOptions, currentAPIUser, modelToInsert } = props;
    await this._testResourceOwnership({ appointment, dbServiceAccessOptions, currentAPIUser });
    await this._testAvailableTimeExistence({ appointment, dbServiceAccessOptions });
    await this._testAppointmentTimeConflict({
      appointment,
      dbServiceAccessOptions,
      currentAPIUser,
    });
    const appointmentEntity = await this._appointmentEntity.build({
      ...appointment,
      reservedById: <ObjectId>currentAPIUser.userId,
    });
    modelToInsert.push(appointmentEntity);
  };

  private _testResourceOwnership = async (props: {
    appointment: AppointmentEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
    currentAPIUser: CurrentAPIUser;
  }): Promise<void> => {
    const { appointment, dbServiceAccessOptions, currentAPIUser } = props;
    const packageTransaction = await this._packageTransactionDbService.findById({
      _id: appointment.packageTransactionId,
      dbServiceAccessOptions,
    });
    const isHostedByIdEqual = packageTransaction.hostedById.equals(appointment.hostedById);
    const isReservedByIdEqual = packageTransaction.reservedById.equals(currentAPIUser.userId);
    const hasResourceAccess = isHostedByIdEqual && isReservedByIdEqual;
    const timeDifference = this._dayjs(appointment.endDate).diff(appointment.startDate, 'minute');
    const isCorrectDuration = timeDifference == packageTransaction.lessonDuration;
    if (!hasResourceAccess) {
      throw new Error('Appointment foreign key mismatch.');
    } else if (!isCorrectDuration) {
      throw new Error('Appointment duration mismatch.');
    }
  };

  private _testAvailableTimeExistence = async (props: {
    appointment: AppointmentEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { appointment, dbServiceAccessOptions } = props;
    const { hostedById, startDate, endDate } = appointment;
    const availableTime = await this._availableTimeDbService.findOne({
      searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      dbServiceAccessOptions,
    });
    if (!availableTime) {
      throw new Error('You cannot have an appointment with no corresponding available time slot.');
    }
  };

  private _testAppointmentTimeConflict = async (props: {
    appointment: AppointmentEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
    currentAPIUser: CurrentAPIUser;
  }): Promise<void> => {
    const { appointment, dbServiceAccessOptions, currentAPIUser } = props;
    const { hostedById, startDate, endDate } = appointment;
    const overlappingHostedByAppointment = await this._dbService.findOne({
      searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      dbServiceAccessOptions,
    });
    const overlappingReservedByAppointment = await this._dbService.findOne({
      searchQuery: {
        reservedById: currentAPIUser.userId,
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
      },
      dbServiceAccessOptions,
    });
    if (overlappingHostedByAppointment || overlappingReservedByAppointment) {
      throw new Error('You cannot have appointments that overlap.');
    }
  };

  private _testSameAppointmentType = (appointments: AppointmentEntityBuildResponse[]) => {
    const hostedById = appointments[0].hostedById;
    const reservedById = appointments[0].reservedById;
    const packageTransactionId = appointments[0].packageTransactionId;
    const sameAppointmentTypeCount = appointments.filter((appointment) => {
      const isHostedByIdEqual = this._deepEqual(appointment.hostedById, hostedById);
      const isReservedByIdEqual = this._deepEqual(appointment.reservedById, reservedById);
      const isPackageTransactionIdEqual = this._deepEqual(
        appointment.packageTransactionId,
        packageTransactionId
      );
      return isHostedByIdEqual && isReservedByIdEqual && isPackageTransactionIdEqual;
    }).length;
    if (sameAppointmentTypeCount != appointments.length) {
      throw new Error('All appointments must be of the same type.');
    }
  };

  private _decrementAppointmentCount = async (
    appointments: AppointmentDoc[]
  ): Promise<PackageTransactionDoc> => {
    const packageTransactionId = appointments[0].packageTransactionId;
    const dbServiceAccessOptions =
      this._packageTransactionDbService.getBaseDbServiceAccessOptions();
    const appointmentsToSubtract = appointments.length * -1;
    const packageTransaction = await this._packageTransactionDbService.findOne({
      searchQuery: { _id: packageTransactionId },
      dbServiceAccessOptions,
    });
    const hasAppointmentsRemaining =
      packageTransaction.remainingAppointments + appointmentsToSubtract >= 0;
    if (hasAppointmentsRemaining) {
      const packageTransaction = await this._packageTransactionDbService.findOneAndUpdate({
        searchQuery: { _id: packageTransactionId },
        updateQuery: {
          $inc: { remainingAppointments: appointmentsToSubtract },
        },
        dbServiceAccessOptions,
      });
      return packageTransaction;
    } else {
      throw new Error('You do not have enough remaining lessons!');
    }
  };

  private _splitAvailableTimeBrancher = async (appointments: AppointmentDoc[]): Promise<void> => {
    if (!IS_PRODUCTION) {
      await this._splitAvailableTimeHandler.split(appointments);
    } else {
      this._splitAvailableTimeHandler.split(appointments);
    }
  };

  private _sendTeacherAppointmentCreationEmail = async (
    savedDbAppointments: AppointmentDoc[]
  ): Promise<void> => {
    savedDbAppointments.sort((a, b) => {
      return this._dayjs(b).valueOf() - this._dayjs(a).valueOf();
    });
    const appointment = savedDbAppointments[0];
    this._emailHandler.sendAlertFromUserId({
      userId: appointment.hostedById,
      emailAlertName: USER_ENTITY_EMAIL_ALERT.APPOINTMENT_CREATION,
      from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
      templateName: EMAIL_HANDLER_TEMPLATE.TEACHER_APPOINTMENT_CREATION,
      data: {
        name: appointment.packageTransactionData.hostedByData.name,
        appointment,
      },
    });
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateAppointmentsUsecaseInitParams
  ): Promise<void> => {
    const {
      makeAppointmentEntity,
      makePackageTransactionDbService,
      makeSplitAvailableTimeHandler,
      makeAvailableTimeDbService,
      makeEmailHandler,
      dayjs,
    } = optionalInitParams;
    this._appointmentEntity = await makeAppointmentEntity;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._splitAvailableTimeHandler = await makeSplitAvailableTimeHandler;
    this._availableTimeDbService = await makeAvailableTimeDbService;
    this._dayjs = dayjs;
    this._emailHandler = await makeEmailHandler;
  };
}

export { CreateAppointmentsUsecase, CreateAppointmentsUsecaseResponse };
