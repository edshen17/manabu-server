import { ObjectId } from 'mongoose';
import { IS_PRODUCTION } from '../../../../constants';
import { AppointmentDoc } from '../../../../models/Appointment';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AppointmentDbServiceResponse } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AvailableTimeEntity } from '../../../entities/availableTime/availableTimeEntity';
import { AppointmentEntityValidator } from '../../../validators/appointment/entity/appointmentEntityValidator';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { SplitAvailableTimeHandler } from '../../utils/splitAvailableTimeHandler/splitAvailableTimeHandler';

type OptionalEditAppointmentUsecaseInitParams = {
  makeSplitAvailableTimeHandler: Promise<SplitAvailableTimeHandler>;
  makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
  makeEditEntityValidator: AppointmentEntityValidator;
  makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
};

type EditAppointmentUsecaseResponse = {
  appointment: AppointmentDoc;
};

class EditAppointmentUsecase extends AbstractEditUsecase<
  OptionalEditAppointmentUsecaseInitParams,
  EditAppointmentUsecaseResponse,
  AppointmentDbServiceResponse
> {
  private _splitAvailableTimeHandler!: SplitAvailableTimeHandler;
  private _availableTimeDbService!: AvailableTimeDbService;
  private _availableTimeEntity!: AvailableTimeEntity;

  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: true,
      paramIdName: 'appointmentId',
    };
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditAppointmentUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions, currentAPIUser } = props;
    const { appointmentId } = params;
    this._testIsValidEdit({ body, currentAPIUser });
    const appointment = await this._editAppointment({
      appointmentId,
      body,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      appointment,
    };
    return usecaseRes;
  };

  private _testIsValidEdit = (props: {
    body: StringKeyObject;
    currentAPIUser: CurrentAPIUser;
  }): void => {
    const { body, currentAPIUser } = props;
    const { status } = body;
    const { role } = currentAPIUser;
    if (status == 'confirmed' && role == 'user') {
      throw new Error('Access denied.');
    }
  };

  private _editAppointment = async (props: {
    appointmentId: ObjectId;
    body: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AppointmentDoc> => {
    const { appointmentId, body, dbServiceAccessOptions } = props;
    const appointment = await this._dbService.findOneAndUpdate({
      searchQuery: { _id: appointmentId },
      updateQuery: body,
      dbServiceAccessOptions,
    });
    await this._splitAvailableTimeBrancher([appointment]);
    if (appointment.status == 'cancelled') {
      const { hostedById, startDate, endDate } = appointment;
      const availableTimeEntity = await this._availableTimeEntity.build({
        hostedById,
        startDate,
        endDate,
      });
      this._availableTimeDbService.insert({
        modelToInsert: availableTimeEntity,
        dbServiceAccessOptions,
      });
    }
    return appointment;
  };

  private _splitAvailableTimeBrancher = async (appointments: AppointmentDoc[]): Promise<void> => {
    if (!IS_PRODUCTION) {
      await this._splitAvailableTimeHandler.split(appointments);
    } else {
      this._splitAvailableTimeHandler.split(appointments);
    }
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalEditAppointmentUsecaseInitParams
  ): Promise<void> => {
    const {
      makeSplitAvailableTimeHandler,
      makeEditEntityValidator,
      makeAvailableTimeDbService,
      makeAvailableTimeEntity,
    } = optionalInitParams;
    this._splitAvailableTimeHandler = await makeSplitAvailableTimeHandler;
    this._editEntityValidator = makeEditEntityValidator;
    this._availableTimeDbService = await makeAvailableTimeDbService;
    this._availableTimeEntity = await makeAvailableTimeEntity;
  };
}

export { EditAppointmentUsecase, EditAppointmentUsecaseResponse };
