import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalMinuteBankEntityInitParams = {};

type MinuteBankEntityBuildParams = {
  hostedById: ObjectId;
  reservedById: ObjectId;
};

type MinuteBankEntityBuildResponse = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  minuteBank: number;
  lastUpdated: Date;
};

class MinuteBankEntity extends AbstractEntity<
  OptionalMinuteBankEntityInitParams,
  MinuteBankEntityBuildParams,
  MinuteBankEntityBuildResponse
> {
  protected _buildTemplate = async (
    buildParams: MinuteBankEntityBuildParams
  ): Promise<MinuteBankEntityBuildResponse> => {
    const { hostedById, reservedById } = buildParams;
    const minuteBankEntity = Object.freeze({
      hostedById,
      reservedById,
      minuteBank: 0,
      lastUpdated: new Date(),
    });
    return minuteBankEntity;
  };
}

export { MinuteBankEntity, MinuteBankEntityBuildParams, MinuteBankEntityBuildResponse };
