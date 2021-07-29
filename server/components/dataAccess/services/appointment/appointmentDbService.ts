import { AppointmentDoc } from '../../../../models/Appointment';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { DbServiceAccessOptions, DB_SERVICE_JOIN_TYPE } from '../../abstractions/IDbService';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';

type OptionalAppointmentDbServiceInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};

class AppointmentDbService extends AbstractDbService<
  OptionalAppointmentDbServiceInitParams,
  AppointmentDoc
> {
  private _packageTransactionDbService!: PackageTransactionDbService;

  protected _getComputedProps = async (props: {
    dbDoc: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<StringKeyObject> => {
    const { dbDoc, dbServiceAccessOptions } = props;
    const packageTransactionId = dbDoc['packageTransactionId'];
    const packageTransactionData = await this._getDbDataById({
      dbService: this._packageTransactionDbService,
      dbServiceAccessOptions,
      _id: packageTransactionId,
    });
    return {
      packageTransactionData,
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
