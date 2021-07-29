import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { PackageDbService } from '../package/packageDbService';
import { UserDbService } from '../user/userDbService';
import { DbServiceAccessOptions, DB_SERVICE_JOIN_TYPE } from '../../abstractions/IDbService';
import {
  LocationData,
  LocationDataHandler,
} from '../../../entities/utils/locationDataHandler/locationDataHandler';
import { ObjectId } from 'mongoose';

type OptionalPackageTransactionDbServiceInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageDbService: Promise<PackageDbService>;
  makeLocationDataHandler: LocationDataHandler;
};

class PackageTransactionDbService extends AbstractDbService<
  OptionalPackageTransactionDbServiceInitParams,
  PackageTransactionDoc
> {
  private _userDbService!: UserDbService;
  private _packageDbService!: PackageDbService;
  private _locationDataHandler!: LocationDataHandler;

  protected _getComputedProps = async (props: {
    dbDoc: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<StringKeyObject> => {
    const { dbDoc, dbServiceAccessOptions } = props;
    const hostedById = dbDoc['hostedById'];
    const reservedById = dbDoc['reservedById'];
    const packageId = dbDoc['packageId'];
    const hostedByData = await this._getDbDataById({
      dbService: this._userDbService,
      dbServiceAccessOptions,
      _id: hostedById,
    });
    const reservedByData = await this._getDbDataById({
      dbService: this._userDbService,
      dbServiceAccessOptions,
      _id: reservedById,
    });
    const packageData = await this._getDbDataById({
      dbService: this._packageDbService,
      dbServiceAccessOptions,
      _id: packageId,
    });
    const locationData = await this._getLocationData({ hostedById, reservedById });
    return {
      hostedByData,
      reservedByData,
      packageData,
      locationData,
    };
  };

  private _getLocationData = async (props: {
    hostedById: ObjectId;
    reservedById: ObjectId;
  }): Promise<LocationData> => {
    const { hostedById, reservedById } = props;
    const overrideDbSerivceAccessOptions = this._getBaseDbServiceAccessOptions();
    overrideDbSerivceAccessOptions.isOverrideView = true;
    const overrideHostedByData = await this._userDbService.findById({
      _id: hostedById,
      dbServiceAccessOptions: overrideDbSerivceAccessOptions,
    });
    const overrideReservedByData = await this._userDbService.findById({
      _id: reservedById,
      dbServiceAccessOptions: overrideDbSerivceAccessOptions,
    });
    const locationData = this._locationDataHandler.getLocationData({
      hostedByData: overrideHostedByData,
      reservedByData: overrideReservedByData,
    });
    return locationData;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalPackageTransactionDbServiceInitParams
  ) => {
    const { makeUserDbService, makePackageDbService, makeLocationDataHandler } =
      optionalDbServiceInitParams;
    this._userDbService = await makeUserDbService;
    this._packageDbService = await makePackageDbService;
    this._locationDataHandler = makeLocationDataHandler;
    this._joinType = DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
  };
}

export { PackageTransactionDbService };
