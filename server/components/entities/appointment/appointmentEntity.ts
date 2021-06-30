import { PackageTransactionDoc } from '../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { PackageTransactionDbService } from '../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type AppointmentEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};

type AppointmentEntityBuildParams = {
  hostedBy: string;
  reservedBy: string;
  packageTransactionId: string;
  from: Date;
  to: Date;
};

type AppointmentEntityBuildResponse = {
  hostedBy: string;
  reservedBy: string;
  packageTransactionId: string;
  from: Date;
  to: Date;
  isPast: boolean;
  status: string;
  cancellationReason?: string;
  hostedByData: any;
  reservedByData: any;
  packageTransactionData: PackageTransactionDoc;
  locationData: LocationData;
};

type LocationData = {
  method: string;
  hostedByMethodId?: string;
  reservedByMethodId?: string;
  isOnline: boolean;
  alternativeCo1ntact?: {
    method: string;
    reservedByMethodId: string;
  };
};

class AppointmentEntity extends AbstractEntity<
  AppointmentEntityInitParams,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse
> {
  private _userDbService!: UserDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  protected _dbServiceAccessOptions: DbServiceAccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: 'user',
    isOverrideView: true,
  };

  public build = async (
    entityBuildParams: AppointmentEntityBuildParams
  ): Promise<AppointmentEntityBuildResponse> => {
    const appointmentEntity = await this._buildAppointmentEntity(entityBuildParams);
    return appointmentEntity;
  };

  private _buildAppointmentEntity = async (
    entityBuildParams: AppointmentEntityBuildParams
  ): Promise<AppointmentEntityBuildResponse> => {
    const { hostedBy, reservedBy, packageTransactionId, from, to } = entityBuildParams;
    const { hostedByData, reservedByData, packageTransactionData, locationData } =
      await this._getDbDataDependencies({ hostedBy, reservedBy, packageTransactionId });
    const appointmentEntity = Object.freeze({
      hostedBy,
      reservedBy,
      packageTransactionId,
      from,
      to,
      isPast: false,
      status: 'pending',
      hostedByData: hostedByData || {},
      reservedByData: reservedByData || {},
      packageTransactionData: packageTransactionData || {},
      locationData: locationData || {},
    });
    return appointmentEntity;
  };

  private _getDbDataDependencies = async (entityInitParams: {
    hostedBy: string;
    reservedBy: string;
    packageTransactionId: string;
  }) => {
    const { hostedBy, reservedBy, packageTransactionId } = entityInitParams;
    // need to override to get user's commMethods
    const overrideHostedByData = await this.getDbDataById({
      dbService: this._userDbService,
      _id: hostedBy,
      overrideDbServiceAccessOptions: this._dbServiceAccessOptions,
    });
    const overrideReservedByData = await this.getDbDataById({
      dbService: this._userDbService,
      _id: reservedBy,
      overrideDbServiceAccessOptions: this._dbServiceAccessOptions,
    });
    const hostedByData = this._getRestrictedUserData(overrideHostedByData);
    const reservedByData = this._getRestrictedUserData(overrideReservedByData);
    const packageTransactionData = await this.getDbDataById({
      dbService: this._packageTransactionDbService,
      _id: packageTransactionId,
    });
    const locationData = this._getLocationData(overrideHostedByData, overrideReservedByData);
    const dataDependencies = {
      hostedByData,
      reservedByData,
      packageTransactionData,
      locationData,
    };

    return dataDependencies;
  };

  private _getRestrictedUserData = async (overrideUserData: JoinedUserDoc) => {
    const { email, password, verificationToken, settings, commMethods, ...restrictedUserData } =
      overrideUserData;
    return restrictedUserData;
  };

  private _getLocationData = (hostedByData: any, reservedByData: any) => {
    const commonCommMethod = hostedByData.commMethods.filter(
      (hostedByCommMethod: { method: string; id: string }) => {
        return hostedByCommMethod.method == reservedByData.commMethods[0].method;
      }
    );
    const hasCommonCommMethod = commonCommMethod.length > 0;
    if (hasCommonCommMethod) {
      return {
        method: commonCommMethod[0].method,
        hostedByMethodId: commonCommMethod[0].id,
        reservedByMethodId: reservedByData.commMethods[0].id,
        isOnline: true,
      };
    } else {
      const hostedByCommMethod = hostedByData.commMethods[0];
      const reservedByCommMethod = reservedByData.commMethods[0];
      return {
        method: hostedByCommMethod.method,
        hostedByMethodId: hostedByCommMethod.id,
        alternativeContact: {
          method: reservedByCommMethod.method,
          reservedByMethodId: reservedByCommMethod.id,
        },
        isOnline: true,
      };
    }
  };

  public init = async (entityInitParams: AppointmentEntityInitParams): Promise<this> => {
    const { makeUserDbService, makePackageTransactionDbService } = entityInitParams;
    this._userDbService = await makeUserDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    return this;
  };
}

export { AppointmentEntity, AppointmentEntityBuildParams, AppointmentEntityBuildResponse };
