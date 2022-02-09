import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';
declare type OptionalAvailableTimeEntityInitParams = {};
declare type AvailableTimeEntityBuildParams = {
    hostedById: ObjectId;
    startDate: Date;
    endDate: Date;
};
declare type AvailableTimeEntityBuildResponse = {
    hostedById: ObjectId;
    startDate: Date;
    endDate: Date;
    createdDate: Date;
    lastModifiedDate: Date;
};
declare class AvailableTimeEntity extends AbstractEntity<OptionalAvailableTimeEntityInitParams, AvailableTimeEntityBuildParams, AvailableTimeEntityBuildResponse> {
    protected _buildTemplate: (buildParams: AvailableTimeEntityBuildParams) => Promise<AvailableTimeEntityBuildResponse>;
}
export { AvailableTimeEntity, AvailableTimeEntityBuildParams, AvailableTimeEntityBuildResponse };
