import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { AppointmentDbService } from '../appointment/appointmentDbService';
import { AppointmentDoc } from '../../../../models/Appointment';
import { DbServiceAccessOptions, IDbService } from '../../abstractions/IDbService';
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
    updateDependentPromises: Promise<any>[];
    updatedDependeeDoc: PackageTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { updateDependentPromises, ...getUpdateDependeePromisesProps } = props;
    const toUpdatePackageTransactionPromises = await this._getUpdateDependeePromises({
      ...getUpdateDependeePromisesProps,
      dependencyDbService: this._appointmentDbService,
    });
    updateDependentPromises.push(...toUpdatePackageTransactionPromises);
  };

  protected _getUpdateDependeePromises = async (props: {
    updatedDependeeDoc: PackageTransactionDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    dependencyDbService: IDbService<any, any>;
  }): Promise<Promise<any>[]> => {
    const { updatedDependeeDoc, dbServiceAccessOptions, dependencyDbService } = props;
    const updatedLocationData = await this._getUpdatedLocationData(updatedDependeeDoc);
    const toUpdateAppointmentPromises = dependencyDbService.updateMany({
      searchQuery: { packageTransactionId: updatedDependeeDoc._id },
      updateParams: {
        packageTransactionData: updatedDependeeDoc,
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
