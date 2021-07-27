import { AppointmentDoc } from '../../../../models/Appointment';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { DB_SERVICE_JOIN_TYPE } from '../../abstractions/IDbService';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';

type OptionalAppointmentDbServiceInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};

class AppointmentDbService extends AbstractDbService<
  OptionalAppointmentDbServiceInitParams,
  AppointmentDoc
> {
  private _packageTransactionDbService!: PackageTransactionDbService;
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }

  protected _getForeignKeyObj = (): {} => {
    return {
      packageTransactionData: {
        dbService: this._packageTransactionDbService,
        foreignKeyName: 'packageTransactionId',
      },
    };
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalAppointmentDbServiceInitParams
  ) => {
    const { makePackageTransactionDbService } = optionalDbServiceInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._joinType = DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
  };
}

export { AppointmentDbService };
