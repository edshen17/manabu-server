import { ObjectId } from 'mongoose';
import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalAppointmentEntityInitParams = {};

type AppointmentEntityBuildParams = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageTransactionId: ObjectId;
  startTime: Date;
  endTime: Date;
};

type AppointmentEntityBuildResponse = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageTransactionId: ObjectId;
  startTime: Date;
  endTime: Date;
  isPast: boolean;
  status: string;
  cancellationReason?: string;
  lastUpdated: Date;
};

class AppointmentEntity extends AbstractEntity<
  OptionalAppointmentEntityInitParams,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse
> {
  protected _dbServiceAccessOptions: DbServiceAccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: 'user',
    isOverrideView: true,
  };

  protected _buildTemplate = async (
    buildParams: AppointmentEntityBuildParams
  ): Promise<AppointmentEntityBuildResponse> => {
    const { hostedById, reservedById, packageTransactionId, startTime, endTime } = buildParams;
    const appointmentEntity = Object.freeze({
      hostedById,
      reservedById,
      packageTransactionId,
      startTime,
      endTime,
      isPast: false,
      status: 'pending',
      lastUpdated: new Date(),
    });
    return appointmentEntity;
  };
}

export { AppointmentEntity, AppointmentEntityBuildParams, AppointmentEntityBuildResponse };
