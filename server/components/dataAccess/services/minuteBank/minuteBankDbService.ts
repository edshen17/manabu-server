import { IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { MinuteBankDoc } from '../../../../models/MinuteBank';

type MinuteBankDbServiceInitParams = {};

class MinuteBankDbService
  extends AbstractDbService<MinuteBankDbServiceInitParams, MinuteBankDoc>
  implements IDbService<MinuteBankDbServiceInitParams, MinuteBankDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { MinuteBankDbService };
