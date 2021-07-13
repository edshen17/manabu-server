import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { AppointmentDbService } from '../appointment/appointmentDbService';
import { AppointmentDoc } from '../../../../models/Appointment';
import { DbServiceAccessOptions, UPDATE_DB_DEPENDENCY_MODE } from '../../abstractions/IDbService';

type OptionalPackageTransactionDbServiceInitParams = {
  makeAppointmentDbService: Promise<AppointmentDbService>;
};

class PackageTransactionDbService extends AbstractDbService<
  OptionalPackageTransactionDbServiceInitParams,
  PackageTransactionDoc
> {
  constructor() {
    super();
    this._dbModelViews = {
      defaultView: {},
    };
  }

  protected _updateDbDependencyMode: string = UPDATE_DB_DEPENDENCY_MODE.DEEP;
  private _appointmentDbService!: AppointmentDbService;

  protected _updateDeepDbDependenciesTemplate = async (props: {
    dbQueryResult: PackageTransactionDoc[];
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<Promise<AppointmentDoc>[]> => {
    const { dbQueryResult, dbServiceAccessOptions } = props;
    const updateAppointmentPromises: Promise<AppointmentDoc>[] = [];
    dbQueryResult.forEach(async (query) => {
      const updatedPackageTransaction = await this.findById({
        _id: query._id,
        dbServiceAccessOptions,
      });
      // do something with appointment entity to get location data here
      const toUpdateAppointment = this._appointmentDbService.findOneAndUpdate({
        searchQuery: { packageTransactionId: query._id },
        dbServiceAccessOptions,
        updateParams: {
          packageTransactionData: updatedPackageTransaction,
        },
      });
      updateAppointmentPromises.push(toUpdateAppointment);
    });
    return updateAppointmentPromises;
  };

  protected _initTemplate = async (
    partialDbServiceInitParams: OptionalPackageTransactionDbServiceInitParams
  ) => {
    const { makeAppointmentDbService } = partialDbServiceInitParams;
    this._appointmentDbService = await makeAppointmentDbService;
  };
}

export { PackageTransactionDbService };
