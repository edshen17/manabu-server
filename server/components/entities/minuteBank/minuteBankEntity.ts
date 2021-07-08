import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntityValidator } from '../abstractions/IEntityValidator';

type OptionalMinuteBankEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

type MinuteBankEntityBuildParams = {
  hostedBy: string;
  reservedBy: string;
};

type MinuteBankEntityBuildResponse = {
  hostedBy: string;
  reservedBy: string;
  minuteBank: number;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
};

class MinuteBankEntity extends AbstractEntity<
  OptionalMinuteBankEntityInitParams,
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
    const { hostedBy, reservedBy } = buildParams;
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
      minuteBank: 0,
      hostedByData: hostedByData || {},
      reservedByData: reservedByData || {},
    });
    return minuteBankEntity;
  };

  protected _initTemplate = async (
    partialInitParams: Omit<
      {
        makeEntityValidator: IEntityValidator;
      } & OptionalMinuteBankEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { makeUserDbService } = partialInitParams;
    this._userDbService = await makeUserDbService;
  };
}

export { MinuteBankEntity, MinuteBankEntityBuildParams, MinuteBankEntityBuildResponse };
