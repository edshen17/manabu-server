import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalAvailableTimeEntityInitParams = {};

type AvailableTimeEntityBuildParams = {
  hostedById: ObjectId;
  startDate: Date;
  endDate: Date;
};

type AvailableTimeEntityBuildResponse = {
  hostedById: ObjectId;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
  lastModifiedDate: Date;
};

class AvailableTimeEntity extends AbstractEntity<
  OptionalAvailableTimeEntityInitParams,
  AvailableTimeEntityBuildParams,
  AvailableTimeEntityBuildResponse
> {
  protected _buildTemplate = async (
    buildParams: AvailableTimeEntityBuildParams
  ): Promise<AvailableTimeEntityBuildResponse> => {
    const { hostedById, startDate, endDate } = buildParams;
    const minuteBankEntity = Object.freeze({
      hostedById,
      startDate,
      endDate,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    });
    return minuteBankEntity;
  };
}

export { AvailableTimeEntity, AvailableTimeEntityBuildParams, AvailableTimeEntityBuildResponse };
