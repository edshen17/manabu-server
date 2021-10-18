import { ObjectId } from 'mongoose';
import { AppointmentDoc } from '../../../../models/Appointment';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditAppointmentUsecaseInitParams = {};

type EditAppointmentUsecaseResponse = {
  appointment: AppointmentDoc;
};

class EditAppointmentUsecase extends AbstractEditUsecase<
  OptionalEditAppointmentUsecaseInitParams,
  EditAppointmentUsecaseResponse,
  AppointmentDoc
> {
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
    return appointment;
  };
}

export { EditAppointmentUsecase, EditAppointmentUsecaseResponse };
