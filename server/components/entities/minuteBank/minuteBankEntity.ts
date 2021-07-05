import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type MinuteBankEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

type MinuteBankEntityBuildParams = {
  hostedBy: string;
  reservedBy: string;
  minuteBank?: number;
};

type MinuteBankEntityBuildResponse = {
  hostedBy: string;
  reservedBy: string;
  minuteBank: number;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
  lastUpdated: Date;
};

class MinuteBankEntity extends AbstractEntity<
  MinuteBankEntityInitParams,
  MinuteBankEntityBuildParams,
  MinuteBankEntityBuildResponse
> {
  private _userDbService!: UserDbService;

  public build = async (
    buildParams: MinuteBankEntityBuildParams
  ): Promise<MinuteBankEntityBuildResponse> => {
    const minuteBankEntity = this._buildMinuteBankEntity(buildParams);
    return minuteBankEntity;
  };

  private _buildMinuteBankEntity = async (
    buildParams: MinuteBankEntityBuildParams
  ): Promise<MinuteBankEntityBuildResponse> => {
    const { hostedBy, reservedBy, minuteBank } = buildParams;
    const hostedByData = await this.getDbDataById({
      dbService: this._userDbService,
      _id: hostedBy,
    });
    const reservedByData = await this.getDbDataById({
      dbService: this._userDbService,
      _id: reservedBy,
    });
    const minuteBankEntity = Object.freeze({
      hostedBy,
      reservedBy,
      minuteBank: minuteBank || 0,
      hostedByData: hostedByData || {},
      reservedByData: reservedByData || {},
      lastUpdated: new Date(),
    });
    return minuteBankEntity;
  };

  public init = async (initParams: MinuteBankEntityInitParams): Promise<this> => {
    const { makeUserDbService } = initParams;
    this._userDbService = await makeUserDbService;
    return this;
  };
}

export { MinuteBankEntity, MinuteBankEntityBuildParams, MinuteBankEntityBuildResponse };
