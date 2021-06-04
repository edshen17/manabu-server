import { IDbOperations } from '../abstractions/IDbOperations';
import { CommonDbOperations } from '../abstractions/CommonDbOperations';
import { MinuteBankDoc } from '../../../models/MinuteBank';

class MinuteBankDbService
  extends CommonDbOperations<MinuteBankDoc>
  implements IDbOperations<MinuteBankDoc>
{
  constructor(props: any) {
    super(props.minuteBankDb);
    this.defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { MinuteBankDbService };
