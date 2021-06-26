import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations } from '../../abstractions/AbstractDbOperations';
import { MinuteBankDoc } from '../../../../models/MinuteBank';

class MinuteBankDbService
  extends CommonDbOperations<MinuteBankDoc>
  implements IDbOperations<MinuteBankDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { MinuteBankDbService };
