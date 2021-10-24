import { ObjectId } from 'mongoose';
import { AppointmentDoc } from '../../../../models/Appointment';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AppointmentDbServiceResponse } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetAppointmentUsecaseInitParams = {};

type GetAppointmentUsecaseResponse = { appointment: AppointmentDoc };

class GetAppointmentUsecase extends AbstractGetUsecase<
  OptionalGetAppointmentUsecaseInitParams,
  GetAppointmentUsecaseResponse,
  AppointmentDbServiceResponse
> {
  protected _isProtectedResource = (): boolean => {
    return true;
  };

  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: true,
      paramIdName: 'appointmentId',
    };
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetAppointmentUsecaseResponse> => {
    const { params, dbServiceAccessOptions } = props;
    const { appointmentId } = params;
    const appointment = await this._getAppointment({
      appointmentId,
      dbServiceAccessOptions,
    });
    if (!appointment) {
      throw new Error('Appointment not found.');
    }
    return { appointment };
  };

  private _getAppointment = async (props: {
    appointmentId: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AppointmentDoc> => {
    const { appointmentId, dbServiceAccessOptions } = props;
    const appointment = await this._dbService.findById({
      _id: appointmentId,
      dbServiceAccessOptions,
    });
    return appointment;
  };
}

export { GetAppointmentUsecase, GetAppointmentUsecaseResponse };
