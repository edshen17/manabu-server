import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { AppointmentDbService } from '../appointment/appointmentDbService';
import { AppointmentDoc } from '../../../../models/Appointment';
import { DbServiceAccessOptions, UPDATE_DB_DEPENDENCY_MODE } from '../../abstractions/IDbService';
import { LocationDataHandler } from '../../../entities/utils/locationDataHandler/locationDataHandler';

type OptionalPackageTransactionDbServiceInitParams = {
  makeAppointmentDbService: Promise<AppointmentDbService>;
  makeLocationDataHandler: LocationDataHandler;
  userModel: any;
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
  private _locationDataHandler!: LocationDataHandler;
  private _userModel!: any;

  protected _updateDeepDbDependenciesTemplate = async (props: {
    dbQueryResult: PackageTransactionDoc[];
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<Promise<AppointmentDoc>[]> => {
    const { dbQueryResult, dbServiceAccessOptions } = props;
    const updateAppointmentPromises: Promise<AppointmentDoc>[] = [];

    dbQueryResult.forEach(async (packageTransaction) => {
      const updatedPackageTransaction = await this.findById({
        _id: packageTransaction._id,
        dbServiceAccessOptions,
      });
      const updatedLocationData = await this._getUpdatedLocationData(updatedPackageTransaction);
      const toUpdateAppointment = this._appointmentDbService.findOneAndUpdate({
        searchQuery: { packageTransactionId: packageTransaction._id },
        dbServiceAccessOptions,
        updateParams: {
          packageTransactionData: updatedPackageTransaction,
          locationData: updatedLocationData,
        },
      });
      updateAppointmentPromises.push(toUpdateAppointment);
    });
    return updateAppointmentPromises;
  };

  private _getUpdatedLocationData = async (updatedPackageTransaction: PackageTransactionDoc) => {
    // use user model instead of userDbService to avoid circular dependency between user > packageTransaction
    const overrideHostedByData = await this._userModel.findById(
      updatedPackageTransaction.hostedById
    );
    const overrideReservedByData = await this._userModel.findById(
      updatedPackageTransaction.reservedById
    );
    const updatedLocationData = this._locationDataHandler.getLocationData({
      hostedByData: overrideHostedByData,
      reservedByData: overrideReservedByData,
    });
    return updatedLocationData;
  };

  protected _initTemplate = async (
    partialDbServiceInitParams: OptionalPackageTransactionDbServiceInitParams
  ) => {
    const { makeAppointmentDbService, makeLocationDataHandler, userModel } =
      partialDbServiceInitParams;
    this._appointmentDbService = await makeAppointmentDbService;
    this._locationDataHandler = makeLocationDataHandler;
    this._userModel = userModel;
  };
}

export { PackageTransactionDbService };
