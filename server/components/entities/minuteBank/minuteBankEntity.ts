import { JoinedUserDoc } from '../../../models/User';
import { UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalMinuteBankEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

type MinuteBankEntityBuildParams = {
  hostedById: string;
  reservedById: string;
};

type MinuteBankEntityBuildResponse = {
  hostedById: string;
  reservedById: string;
  minuteBank: number;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
  lastUpdated: Date;
};

class MinuteBankEntity extends AbstractEntity<
  OptionalMinuteBankEntityInitParams,
  MinuteBankEntityBuildParams,
  MinuteBankEntityBuildResponse
> {
  private _userDbService!: UserDbService;

  protected _buildTemplate = async (
    buildParams: MinuteBankEntityBuildParams
  ): Promise<MinuteBankEntityBuildResponse> => {
    const { hostedById, reservedById } = buildParams;
    const hostedByData = await this.getDbDataById({
      dbService: this._userDbService,
      _id: hostedById,
    });
    const reservedByData = await this.getDbDataById({
      dbService: this._userDbService,
      _id: reservedById,
    });
    const minuteBankEntity = Object.freeze({
      hostedById,
      reservedById,
      minuteBank: 0,
      hostedByData: hostedByData || {},
      reservedByData: reservedByData || {},
      lastUpdated: new Date(),
    });
    return minuteBankEntity;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalMinuteBankEntityInitParams
  ): Promise<void> => {
    const { makeUserDbService } = optionalInitParams;
    this._userDbService = await makeUserDbService;
  };
}

export { MinuteBankEntity, MinuteBankEntityBuildParams, MinuteBankEntityBuildResponse };
