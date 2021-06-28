import { AppointmentDoc } from '../../../../models/Appointment';
import { CommonDbOperations } from '../../abstractions/AbstractDbOperations';
import { IDbOperations } from '../../abstractions/IDbOperations';

class AppointmentDbService
  extends CommonDbOperations<AppointmentDoc>
  implements IDbOperations<AppointmentDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { AppointmentDbService };
