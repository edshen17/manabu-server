import { PackageTransactionDoc } from '../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { PackageTransactionDbService } from '../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntityValidator } from '../abstractions/IEntityValidator';
import { UserContactMethod } from '../user/userEntity';

type OptionalAppointmentEntityInitParams = {
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

type MatchedContactMethod = {
  hostedByContactMethod: UserContactMethod;
  reservedByContactMethod: UserContactMethod;
};

type LocationData = {
  locationName: string;
  locationType: string;
  matchedContactMethod: MatchedContactMethod;
};

class AppointmentEntity extends AbstractEntity<
  OptionalAppointmentEntityInitParams,
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
    buildParams: AppointmentEntityBuildParams
  ): Promise<AppointmentEntityBuildResponse> => {
    const appointmentEntity = await this._buildAppointmentEntity(buildParams);
    return appointmentEntity;
  };

  private _buildAppointmentEntity = async (
    buildParams: AppointmentEntityBuildParams
  ): Promise<AppointmentEntityBuildResponse> => {
    const { hostedBy, reservedBy, packageTransactionId, from, to } = buildParams;
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

  private _getDbDataDependencies = async (props: {
    hostedBy: string;
    reservedBy: string;
    packageTransactionId: string;
  }) => {
    // need to override to get user's contactMethods
    const { hostedBy, reservedBy, packageTransactionId } = props;
    const overrideHostedByData = await this._getOverrideUserData(hostedBy);
    const overrideReservedByData = await this._getOverrideUserData(reservedBy);
    const hostedByData = this._getRestrictedUserData(overrideHostedByData);
    const reservedByData = this._getRestrictedUserData(overrideReservedByData);
    const packageTransactionData = await this._getPackageTransactionData(packageTransactionId);
    const locationData = this._getLocationData({
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

  private _getOverrideUserData = async (_id: string) => {
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

  private _getPackageTransactionData = async (_id: string) => {
    const packageTransactionData = await this.getDbDataById({
      dbService: this._packageTransactionDbService,
      _id,
    });
    return packageTransactionData;
  };

  private _getLocationData = (props: {
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
  }): LocationData => {
    const matchedContactMethod = this._getMatchedContactMethod(props);
    const { hostedByContactMethod, reservedByContactMethod } = matchedContactMethod;
    const isOnline =
      hostedByContactMethod.methodType == 'online' &&
      reservedByContactMethod.methodType == 'online';
    const locationData = <LocationData>{
      matchedContactMethod,
      locationType: isOnline ? 'online' : 'offline',
    };
    if (hostedByContactMethod.methodName == reservedByContactMethod.methodName) {
      locationData.locationName = hostedByContactMethod.methodName;
    } else {
      locationData.locationName = 'alternative';
    }
    return locationData;
  };

  private _getMatchedContactMethod = (props: {
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
  }): MatchedContactMethod => {
    const { hostedByData, reservedByData } = props;
    const matchedContactMethod = <MatchedContactMethod>{
      hostedByContactMethod: {},
      reservedByContactMethod: {},
    };
    const hostedByContactMethods = this._sortByPrimaryContactMethod(hostedByData.contactMethods);
    const reservedByContactMethods = this._sortByPrimaryContactMethod(
      reservedByData.contactMethods
    );
    hostedByContactMethods.forEach((hostedByContactMethod) => {
      reservedByContactMethods.forEach((reservedByContactMethod) => {
        const isSharedContactMethod =
          hostedByContactMethod.methodName == reservedByContactMethod.methodName;
        if (isSharedContactMethod) {
          matchedContactMethod.hostedByContactMethod = hostedByContactMethod;
          matchedContactMethod.reservedByContactMethod = reservedByContactMethod;
          return;
        } else {
          matchedContactMethod.hostedByContactMethod = hostedByContactMethods[0];
          matchedContactMethod.reservedByContactMethod = reservedByContactMethods[0];
        }
      });
    });
    return matchedContactMethod;
  };

  private _sortByPrimaryContactMethod = (contactMethods: UserContactMethod[]) => {
    const sortedByPrimaryContactMethod = contactMethods.sort((a, b) => {
      let aPrefOrder = a.isPrimaryMethod ? 1 : 0;
      let bPrefOrder = b.isPrimaryMethod ? 1 : 0;
      return aPrefOrder - bPrefOrder;
    });
    return sortedByPrimaryContactMethod;
  };

  protected _initTemplate = async (
    partialInitParams: Omit<
      {
        makeEntityValidator: IEntityValidator;
      } & OptionalAppointmentEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { makeUserDbService, makePackageTransactionDbService } = partialInitParams;
    this._userDbService = await makeUserDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
  };
}

export { AppointmentEntity, AppointmentEntityBuildParams, AppointmentEntityBuildResponse };
