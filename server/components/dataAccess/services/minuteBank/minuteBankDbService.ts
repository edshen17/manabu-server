import { IDbOperations } from '../../abstractions/IDbOperations';
import { CommonDbOperations, DefaultDbInitParams } from '../../abstractions/CommonDbOperations';
import { MinuteBankDoc } from '../../../../models/MinuteBank';

class MinuteBankDbService
  extends CommonDbOperations<MinuteBankDoc>
  implements IDbOperations<MinuteBankDoc, DefaultDbInitParams>
{
  constructor() {
    super();
    this.defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { MinuteBankDbService };
