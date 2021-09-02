import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { DbServiceAccessOptions, DB_SERVICE_JOIN_TYPE } from '../../abstractions/IDbService';
import { UserDbService } from '../user/userDbService';

type OptionalMinuteBankDbServiceInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

class MinuteBankDbService extends AbstractDbService<
  OptionalMinuteBankDbServiceInitParams,
  MinuteBankDoc
> {
  private _userDbService!: UserDbService;

  protected _getComputedProps = async (props: {
    dbDoc: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<StringKeyObject> => {
    const { dbDoc, dbServiceAccessOptions } = props;
    const hostedById = dbDoc['hostedById'];
    const reservedById = dbDoc['reservedById'];
    const hostedByData = await this._getDbDataById({
      dbService: this._userDbService,
      dbServiceAccessOptions,
      _id: hostedById,
    });
    const reservedByData = await this._getDbDataById({
      dbService: this._userDbService,
      dbServiceAccessOptions,
      _id: reservedById,
    });
    return {
      hostedByData,
      reservedByData,
    };
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalMinuteBankDbServiceInitParams
  ) => {
    const { makeUserDbService } = optionalDbServiceInitParams;
    this._userDbService = await makeUserDbService;
    this._joinType = DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
  };
}

export { MinuteBankDbService };
