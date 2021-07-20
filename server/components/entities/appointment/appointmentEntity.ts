import { ObjectId } from 'mongoose';
import { PackageTransactionDoc } from '../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../models/User';
import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { PackageTransactionDbService } from '../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import {
  LocationData,
  LocationDataHandler,
} from '../utils/locationDataHandler/locationDataHandler';

type OptionalAppointmentEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeLocationDataHandler: LocationDataHandler;
};

type AppointmentEntityBuildParams = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageTransactionId: ObjectId;
  startTime: Date;
  endTime: Date;
};

type AppointmentEntityBuildResponse = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageTransactionId: ObjectId;
  startTime: Date;
  endTime: Date;
  isPast: boolean;
  status: string;
  cancellationReason?: string;
  packageTransactionData: PackageTransactionDoc;
  locationData: LocationData;
  lastUpdated: Date;
};

class AppointmentEntity extends AbstractEntity<
  OptionalAppointmentEntityInitParams,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse
> {
  private _userDbService!: UserDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _locationDataHandler!: LocationDataHandler;
  protected _dbServiceAccessOptions: DbServiceAccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: 'user',
    isOverrideView: true,
  };

  protected _buildTemplate = async (
    buildParams: AppointmentEntityBuildParams
  ): Promise<AppointmentEntityBuildResponse> => {
    const { hostedById, reservedById, packageTransactionId, startTime, endTime } = buildParams;
    const { packageTransactionData, locationData } = await this._getDbDataDependencies({
      hostedById,
      reservedById,
      packageTransactionId,
    });
    const appointmentEntity = Object.freeze({
      hostedById,
      reservedById,
      packageTransactionId,
      startTime,
      endTime,
      isPast: false,
      status: 'pending',
      packageTransactionData: packageTransactionData || {},
      locationData: locationData || {},
      lastUpdated: new Date(),
    });
    return appointmentEntity;
  };

  private _getDbDataDependencies = async (props: {
    hostedById: ObjectId;
    reservedById: ObjectId;
    packageTransactionId: ObjectId;
  }) => {
    // need to override to get user's contactMethods
    const { hostedById, reservedById, packageTransactionId } = props;
    const overrideHostedByData = await this._getOverrideUserData(hostedById);
    const overrideReservedByData = await this._getOverrideUserData(reservedById);
    const hostedByData = this._getRestrictedUserData(overrideHostedByData);
    const reservedByData = this._getRestrictedUserData(overrideReservedByData);
    const packageTransactionData = await this._getPackageTransactionData(packageTransactionId);
    const locationData = this._locationDataHandler.getLocationData({
      hostedByData: overrideHostedByData,
      reservedByData: overrideReservedByData,
    });
    const dataDependencies = {
      hostedByData,
      reservedByData,
      packageTransactionData,
      locationData,
    };

    return dataDependencies;
  };

  private _getOverrideUserData = async (_id: ObjectId) => {
    const overrideUserData = await this.getDbDataById({
      dbService: this._userDbService,
      _id,
      overrideDbServiceAccessOptions: this._dbServiceAccessOptions,
    });
    return overrideUserData;
  };

  private _getRestrictedUserData = async (overrideUserData: JoinedUserDoc) => {
    const { email, password, verificationToken, settings, contactMethods, ...restrictedUserData } =
      overrideUserData;
    return restrictedUserData;
  };

  private _getPackageTransactionData = async (_id: ObjectId) => {
    const packageTransactionData = await this.getDbDataById({
      dbService: this._packageTransactionDbService,
      _id,
    });
    return packageTransactionData;
  };

  protected _initTemplate = async (
    optionalInitParams: Omit<
      {
        makeEntityValidator: AbstractEntityValidator;
      } & OptionalAppointmentEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { makeUserDbService, makePackageTransactionDbService, makeLocationDataHandler } =
      optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._locationDataHandler = makeLocationDataHandler;
  };
}

export { AppointmentEntity, AppointmentEntityBuildParams, AppointmentEntityBuildResponse };
