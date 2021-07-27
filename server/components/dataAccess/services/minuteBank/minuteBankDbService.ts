import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { UserDbService } from '../user/userDbService';
import { DB_SERVICE_JOIN_TYPE } from '../../abstractions/IDbService';

type OptionalMinuteBankDbServiceInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

class MinuteBankDbService extends AbstractDbService<
  OptionalMinuteBankDbServiceInitParams,
  MinuteBankDoc
> {
  private _userDbService!: UserDbService;
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }

  protected _getForeignKeyObj = (): {} => {
    return {
      hostedByData: {
        dbService: this._userDbService,
        foreignKeyName: 'hostedById',
      },
      reservedByData: {
        dbService: this._userDbService,
        foreignKeyName: 'reservedById',
      },
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
