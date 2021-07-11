import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { AppointmentDbService } from '../appointment/appointmentDbService';
import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageDoc } from '../../../../models/Package';

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

  private _appointmentDbService!: AppointmentDbService;

  public updateManyDbDependencies = async (
    preUpdatePackageTransactions?: PackageTransactionDoc[],
    preUpdatePackages?: PackageDoc[]
  ) => {
    const dbServiceAccessOptions = this._getBaseDbServiceAccessOptions();
    if (preUpdatePackageTransactions) {
      const updateAppointmentPromises: Promise<AppointmentDoc>[] = [];
      preUpdatePackageTransactions.forEach(async (packageTransaction) => {
        const updatedPackageTransaction = await this.findById({
          _id: packageTransaction._id,
          dbServiceAccessOptions,
        });
        const toUpdateAppointment = this._appointmentDbService.findOneAndUpdate({
          searchQuery: { packageTransactionId: packageTransaction._id },
          dbServiceAccessOptions,
          updateParams: {
            packageTransactionData: updatedPackageTransaction,
          },
        });
        updateAppointmentPromises.push(toUpdateAppointment);
      });
      await Promise.all(updateAppointmentPromises);
    }

    if (preUpdatePackages) {
      const updatePackagePromises: Promise<AppointmentDoc>[] = [];
      preUpdatePackages.forEach(async (pkg) => {
        const updatedPackage = await this.findById({
          _id: pkg._id,
          dbServiceAccessOptions,
        });
        const toUpdateAppointment = this._appointmentDbService.findOneAndUpdate({
          searchQuery: { packageTransactionId: pkg._id },
          dbServiceAccessOptions,
          updateParams: {
            packageData: updatedPackage,
          },
        });
        updatePackagePromises.push(toUpdateAppointment);
      });
      await Promise.all(updatePackagePromises);
    }
  };

  protected _initTemplate = async (
    partialDbServiceInitParams: OptionalPackageTransactionDbServiceInitParams
  ) => {
    const { makeAppointmentDbService } = partialDbServiceInitParams;
    this._appointmentDbService = await makeAppointmentDbService;
  };
}

export { PackageTransactionDbService };
