import { ObjectId } from 'mongoose';
import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalAppointmentEntityInitParams = {};

type AppointmentEntityBuildParams = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageTransactionId: ObjectId;
  startDate: Date;
  endDate: Date;
};

type AppointmentEntityBuildResponse = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageTransactionId: ObjectId;
  startDate: Date;
  endDate: Date;
  isPast: boolean;
  status: string;
  cancellationReason?: string;
  createdDate: Date;
  lastModifiedDate: Date;
};

class AppointmentEntity extends AbstractEntity<
  OptionalAppointmentEntityInitParams,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse
> {
  protected _buildTemplate = async (
    buildParams: AppointmentEntityBuildParams
  ): Promise<AppointmentEntityBuildResponse> => {
    const { hostedById, reservedById, packageTransactionId, startDate, endDate } = buildParams;
    const appointmentEntity = Object.freeze({
      hostedById,
      reservedById,
      packageTransactionId,
      startDate,
      endDate,
      isPast: false,
      status: 'pending',
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    });
    return appointmentEntity;
  };
}

export { AppointmentEntity, AppointmentEntityBuildParams, AppointmentEntityBuildResponse };
