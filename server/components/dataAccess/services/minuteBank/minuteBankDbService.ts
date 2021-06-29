import { IDbService } from '../../abstractions/IDbService';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { MinuteBankDoc } from '../../../../models/MinuteBank';

type PartialMinuteBankDbServiceInitParams = {};

class MinuteBankDbService
  extends AbstractDbService<PartialMinuteBankDbServiceInitParams, MinuteBankDoc>
  implements IDbService<PartialMinuteBankDbServiceInitParams, MinuteBankDoc>
{
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }
}

export { MinuteBankDbService };
