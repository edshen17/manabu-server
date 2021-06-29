import { AppointmentDoc } from '../../../../models/Appointment';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { IDbService } from '../../abstractions/IDbService';

type PartialAppointmentDbServiceInitParams = {};

class AppointmentDbService
  extends AbstractDbService<PartialAppointmentDbServiceInitParams, AppointmentDoc>
  implements IDbService<PartialAppointmentDbServiceInitParams, AppointmentDoc>
{
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }
}

export { AppointmentDbService };
