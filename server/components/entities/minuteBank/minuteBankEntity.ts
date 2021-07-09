import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntityValidator } from '../abstractions/IEntityValidator';

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
