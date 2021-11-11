import { ObjectId } from 'mongoose';
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
  status: string;
  cancellationReason?: string;
  creationDate: Date;
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
    const appointmentEntity = {
      hostedById,
      reservedById,
      packageTransactionId,
      startDate,
      endDate,
      status: 'pending',
      creationDate: new Date(),
      lastModifiedDate: new Date(),
    };
    return appointmentEntity;
  };
}

export { AppointmentEntity, AppointmentEntityBuildParams, AppointmentEntityBuildResponse };
