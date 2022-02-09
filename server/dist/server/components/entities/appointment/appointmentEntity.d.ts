import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';
declare type OptionalAppointmentEntityInitParams = {};
declare type AppointmentEntityBuildParams = {
    hostedById: ObjectId;
    reservedById: ObjectId;
    packageTransactionId: ObjectId;
    startDate: Date;
    endDate: Date;
};
declare type AppointmentEntityBuildResponse = {
    hostedById: ObjectId;
    reservedById: ObjectId;
    packageTransactionId: ObjectId;
    startDate: Date;
    endDate: Date;
    status: string;
    cancellationReason?: string;
    createdDate: Date;
    lastModifiedDate: Date;
};
declare class AppointmentEntity extends AbstractEntity<OptionalAppointmentEntityInitParams, AppointmentEntityBuildParams, AppointmentEntityBuildResponse> {
    protected _buildTemplate: (buildParams: AppointmentEntityBuildParams) => Promise<AppointmentEntityBuildResponse>;
}
export { AppointmentEntity, AppointmentEntityBuildParams, AppointmentEntityBuildResponse };
