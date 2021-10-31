import { ObjectId } from 'mongoose';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageDoc } from '../../../../models/Package';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { JoinedUserDoc, USER_EMAIL_ALERT_NAME } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AppointmentDbServiceResponse } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import {
  AppointmentEntity,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse,
} from '../../../entities/appointment/appointmentEntity';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { EmailHandler, EMAIL_SENDER_NAME } from '../../utils/emailHandler/emailHandler';
import { EMAIL_TEMPLATE_NAME } from '../../utils/emailHandler/templates';
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
    const { appointments } = body;
    const savedDbAppointments = await this._createAppointments({
      appointments,
      dbServiceAccessOptions,
      currentAPIUser,
    });
    this._sendAppointmentAlertEmail(savedDbAppointments);
    const usecaseRes = {
      appointments: savedDbAppointments,
    };
    return usecaseRes;
  };

  private _createAppointments = async (props: {
    appointments: AppointmentEntityBuildParams[];
    dbServiceAccessOptions: DbServiceAccessOptions;
    currentAPIUser: CurrentAPIUser;
  }): Promise<AppointmentDoc[]> => {
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
    await this._decrementAppointmentCount(savedDbAppointments);
    await this._splitAvailableTimeBrancher(savedDbAppointments);
    return savedDbAppointments;
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
    const isHostedByIdEqual = this._deepEqual(
      packageTransaction.hostedById,
      appointment.hostedById
    );
    const isReservedByIdEqual = this._deepEqual(
      packageTransaction.reservedById,
      currentAPIUser.userId
    );
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

  private _decrementAppointmentCount = async (appointments: AppointmentDoc[]): Promise<void> => {
    const packageTransactionId = appointments[0].packageTransactionId;
    const dbServiceAccessOptions =
      this._packageTransactionDbService.getBaseDbServiceAccessOptions();
    const appointmentsToSubtract = appointments.length * -1;
    // check if remainingAppointments > 0
    await this._packageTransactionDbService.findOneAndUpdate({
      searchQuery: { _id: packageTransactionId },
      updateQuery: {
        $inc: { remainingAppointments: appointmentsToSubtract },
      },
      dbServiceAccessOptions,
    });
  };

  private _splitAvailableTimeBrancher = async (appointments: AppointmentDoc[]): Promise<void> => {
    const isAsync = process.env.NODE_ENV != 'production';
    if (isAsync) {
      await this._splitAvailableTimeHandler.split(appointments);
    } else {
      this._splitAvailableTimeHandler.split(appointments);
    }
  };

  private _sendAppointmentAlertEmail = async (
    savedDbAppointments: AppointmentDoc[]
  ): Promise<void> => {
    const packageTransactionData = savedDbAppointments[0].packageTransactionData;
    const hostedByData = packageTransactionData.hostedByData;
    const reservedByData = packageTransactionData.reservedByData;
    const packageData = packageTransactionData.packageData;
    const appointmentAmount = savedDbAppointments.length;
    const isMultipleReservations = appointmentAmount > 1;
    const alertEmailParams = this._getAlertEmailParams({
      hostedByData,
      reservedByData,
      appointmentAmount,
      isMultipleReservations,
      packageData,
      packageTransactionData,
    });
    this._emailHandler.sendAlertEmailFromUserId(alertEmailParams);
  };

  private _getAlertEmailParams = (props: {
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
    appointmentAmount: number;
    isMultipleReservations: boolean;
    packageData: PackageDoc;
    packageTransactionData: PackageTransactionDoc;
  }) => {
    const { hostedByData, reservedByData, appointmentAmount, isMultipleReservations } = props;
    const subjectLine = `You have ${appointmentAmount} new ${
      isMultipleReservations ? 'appointments' : 'appointment'
    } from ${reservedByData.name} that ${
      isMultipleReservations ? 'need' : 'needs'
    } to be confirmed.`;
    const alertEmailParams = {
      userId: hostedByData._id,
      emailAlertName: USER_EMAIL_ALERT_NAME.APPOINTMENT_CREATION,
      sendFrom: EMAIL_SENDER_NAME.NOREPLY,
      subjectLine,
      mjmlFileName: EMAIL_TEMPLATE_NAME.APPOINTMENT_CREATION,
      data: {
        bodyText: `Please confirm the ${
          isMultipleReservations ? 'appointments' : 'appointment'
        } made by ${reservedByData.name}`,
        ...props,
      },
    };
    return alertEmailParams;
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
