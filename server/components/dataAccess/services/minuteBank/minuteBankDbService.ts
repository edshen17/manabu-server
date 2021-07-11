import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { MinuteBankDoc } from '../../../../models/MinuteBank';

type OptionalMinuteBankDbServiceInitParams = {};

class MinuteBankDbService extends AbstractDbService<
  OptionalMinuteBankDbServiceInitParams,
  MinuteBankDoc
> {
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }
}

export { MinuteBankDbService };
