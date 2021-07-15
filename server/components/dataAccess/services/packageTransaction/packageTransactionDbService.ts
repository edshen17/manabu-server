import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { AppointmentDbService } from '../appointment/appointmentDbService';
import { AppointmentDoc } from '../../../../models/Appointment';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
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

  private _appointmentDbService!: AppointmentDbService;
  private _locationDataHandler!: LocationDataHandler;
  private _userModel!: any;

  protected _updateDbDependencyControllerTemplate = async (props: {
    updatedDependeeDocs: PackageTransactionDoc[];
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { updatedDependeeDocs } = props;
    const toUpdateDependentPromises: Promise<any>[] = [];
    for (const updatedPackageTransactionDoc of updatedDependeeDocs) {
      const toUpdatePackageTransactionPromises = await this._getToUpdateDependentPromises({
        ...props,
        updatedDependentDoc: updatedPackageTransactionDoc,
        dependencyDbService: this._appointmentDbService,
      });
      toUpdateDependentPromises.push(...toUpdatePackageTransactionPromises);
    }
    return toUpdateDependentPromises;
  };

  private _getToUpdateDependentPromises = async (props: {
    updatedDependentDoc: PackageTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: AppointmentDbService;
  }): Promise<Promise<any>[]> => {
    const { updatedDependentDoc, dbServiceAccessOptions, dependencyDbService } = props;
    const updatedLocationData = await this._getUpdatedLocationData(updatedDependentDoc);
    const toUpdateAppointmentPromises = dependencyDbService.updateMany({
      searchQuery: { packageTransactionId: updatedDependentDoc._id },
      updateParams: {
        packageTransactionData: updatedDependentDoc,
        locationData: updatedLocationData,
      },
      dbServiceAccessOptions,
    });
    return [toUpdateAppointmentPromises];
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
