import { AppointmentDoc } from '../../../../models/Appointment';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import {
  AppointmentEntity,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse,
} from '../../../entities/appointment/appointmentEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { SplitAvailableTimeHandler } from '../../utils/splitAvailableTimeHandler/splitAvailableTimeHandler';

type OptionalCreateAppointmentsUsecaseInitParams = {
  makeAppointmentEntity: Promise<AppointmentEntity>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeSplitAvailableTimeHandler: Promise<SplitAvailableTimeHandler>;
  dayjs: any;
};

type CreateAppointmentsUsecaseResponse = {
  appointments: AppointmentDoc[];
};

class CreateAppointmentsUsecase extends AbstractCreateUsecase<
  OptionalCreateAppointmentsUsecaseInitParams,
  CreateAppointmentsUsecaseResponse
> {
  private _appointmentEntity!: AppointmentEntity;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _splitAvailableTimeHandler!: SplitAvailableTimeHandler;
  private _dayjs!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateAppointmentsUsecaseResponse> => {
    const { body, dbServiceAccessOptions } = props;
    const { appointments } = body;
    const savedDbAppointments = await this._createAppointments({
      appointments,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      appointments: savedDbAppointments,
    };
    return usecaseRes;
  };

  private _createAppointments = async (props: {
    appointments: AppointmentEntityBuildParams[];
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AppointmentDoc[]> => {
    const { appointments, dbServiceAccessOptions } = props;
    const modelToInsert: AppointmentEntityBuildResponse[] = [];
    for (const appointment of appointments) {
      await this._testResourceOwnership({ appointment, dbServiceAccessOptions });
      await this._testTimeConflict({ appointment, dbServiceAccessOptions });
      const appointmentEntity = await this._appointmentEntity.build(appointment);
      modelToInsert.push(appointmentEntity);
    }
    const savedDbAppointments = await this._dbService.insertMany({
      modelToInsert,
      dbServiceAccessOptions,
    });
    await this._splitAvailableTimeBrancher(savedDbAppointments);
    return savedDbAppointments;
  };

  private _testResourceOwnership = async (props: {
    appointment: AppointmentEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { appointment, dbServiceAccessOptions } = props;
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
      appointment.reservedById
    );
    const timeDifference = this._dayjs(appointment.endDate).diff(appointment.startDate, 'minute');
    const isCorrectDuration = timeDifference == packageTransaction.lessonDuration;
    const hasResourceOwnership = isHostedByIdEqual && isReservedByIdEqual;
    if (!hasResourceOwnership) {
      throw new Error('Appointment foreign key mismatch.');
    } else if (!isCorrectDuration) {
      throw new Error('Appointment duration mismatch.');
    }
  };

  private _testTimeConflict = async (props: {
    appointment: AppointmentEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { appointment, dbServiceAccessOptions } = props;
    const { hostedById, startDate, endDate } = appointment;
    const duplicateAppointment = await this._dbService.findOne({
      searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      dbServiceAccessOptions,
    });
    if (duplicateAppointment) {
      throw new Error('You cannot have appointments that overlap.');
    }
  };

  private _splitAvailableTimeBrancher = async (appointments: AppointmentDoc[]): Promise<void> => {
    const isAsync = process.env.NODE_ENV != 'production';
    if (isAsync) {
      await this._splitAvailableTimeHandler.split(appointments);
    } else {
      this._splitAvailableTimeHandler.split(appointments);
    }
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateAppointmentsUsecaseInitParams
  ): Promise<void> => {
    const {
      makeAppointmentEntity,
      makePackageTransactionDbService,
      makeSplitAvailableTimeHandler,
      dayjs,
    } = optionalInitParams;
    this._appointmentEntity = await makeAppointmentEntity;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._splitAvailableTimeHandler = await makeSplitAvailableTimeHandler;
    this._dayjs = dayjs;
  };
}

export { CreateAppointmentsUsecase, CreateAppointmentsUsecaseResponse };
