import { PackageTransactionDoc } from '../../../models/PackageTransaction';
import { JoinedUserDoc } from '../../../models/User';
import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { PackageTransactionDbService } from '../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { UserContactMethod } from '../user/userEntity';

type OptionalAppointmentEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
};

type AppointmentEntityBuildParams = {
  hostedById: string;
  reservedById: string;
  packageTransactionId: string;
  startTime: Date;
  endTime: Date;
};

type AppointmentEntityBuildResponse = {
  hostedById: string;
  reservedById: string;
  packageTransactionId: string;
  startTime: Date;
  endTime: Date;
  isPast: boolean;
  status: string;
  cancellationReason?: string;
  packageTransactionData: PackageTransactionDoc;
  locationData: LocationData;
};

type LocationData = {
  locationName: string;
  locationType: string;
  matchedContactMethod: MatchedContactMethod;
};

type MatchedContactMethod = {
  hostedByContactMethod: UserContactMethod;
  reservedByContactMethod: UserContactMethod;
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
    });
    return appointmentEntity;
  };

  private _getDbDataDependencies = async (props: {
    hostedById: string;
    reservedById: string;
    packageTransactionId: string;
  }) => {
    // need to override to get user's contactMethods
    const { hostedById, reservedById, packageTransactionId } = props;
    const overrideHostedByData = await this._getOverrideUserData(hostedById);
    const overrideReservedByData = await this._getOverrideUserData(reservedById);
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
    optionalInitParams: Omit<
      {
        makeEntityValidator: AbstractEntityValidator;
      } & OptionalAppointmentEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { makeUserDbService, makePackageTransactionDbService } = optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
  };
}

export { AppointmentEntity, AppointmentEntityBuildParams, AppointmentEntityBuildResponse };
