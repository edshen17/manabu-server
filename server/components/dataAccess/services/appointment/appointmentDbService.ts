import { AppointmentDoc } from '../../../../models/Appointment';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { IDbService } from '../../abstractions/IDbService';

type AppointmentDbServiceInitParams = {};

class AppointmentDbService
  extends AbstractDbService<AppointmentDbServiceInitParams, AppointmentDoc>
  implements IDbService<AppointmentDbServiceInitParams, AppointmentDoc>
{
  constructor() {
    super();
    this._defaultSelectOptions = {
      defaultSettings: {},
    };
  }
}

export { AppointmentDbService };
