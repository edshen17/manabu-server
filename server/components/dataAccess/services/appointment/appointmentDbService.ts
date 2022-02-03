import { ObjectId } from 'mongoose';
import { AppointmentDoc } from '../../../../models/Appointment';
import { StringKeyObject } from '../../../../types/custom';
import {
  LocationData,
  LocationDataHandler,
} from '../../../entities/utils/locationDataHandler/locationDataHandler';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import {
  DbServiceAccessOptions,
  DbServiceModelViews,
  DB_SERVICE_JOIN_TYPE,
} from '../../abstractions/IDbService';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { UserDbService } from '../user/userDbService';

type OptionalAppointmentDbServiceInitParams = {
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeUserDbService: Promise<UserDbService>;
  makeLocationDataHandler: LocationDataHandler;
};

type AppointmentDbServiceResponse = AppointmentDoc;

class AppointmentDbService extends AbstractDbService<
  OptionalAppointmentDbServiceInitParams,
  AppointmentDbServiceResponse
> {
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _userDbService!: UserDbService;
  private _locationDataHandler!: LocationDataHandler;

  protected _getDbServiceModelViews = (): DbServiceModelViews => {
    return {
      defaultView: {
        reservedById: 0,
        packageTransactionId: 0,
        cancellationReason: 0,
      },
      adminView: {},
      selfView: {},
      overrideView: {},
    };
  };

  protected _getComputedProps = async (props: {
    dbDoc: AppointmentDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<StringKeyObject> => {
    const { dbDoc, dbServiceAccessOptions } = props;
    const hostedById = dbDoc.hostedById;
    const reservedById = dbDoc.reservedById;
    const packageTransactionId = dbDoc.packageTransactionId;
    const [hostedByData, reservedByData, packageTransactionData, locationData] = await Promise.all([
      this._getDbDataById({
        dbService: this._userDbService,
        dbServiceAccessOptions,
        _id: hostedById,
      }),
      this._getDbDataById({
        dbService: this._userDbService,
        dbServiceAccessOptions,
        _id: reservedById,
      }),
      this._getDbDataById({
        dbService: this._packageTransactionDbService,
        dbServiceAccessOptions,
        _id: packageTransactionId,
      }),
      this._getLocationData({ hostedById, reservedById }),
    ]);
    const computedProps = {
      packageTransactionData,
      locationData,
      hostedByData,
      reservedByData,
    };
    return computedProps;
  };

  private _getLocationData = async (props: {
    hostedById: ObjectId;
    reservedById: ObjectId;
  }): Promise<LocationData> => {
    const { hostedById, reservedById } = props;
    const overrideDbServiceAccessOptions = this._userDbService.getOverrideDbServiceAccessOptions();
    const [overrideHostedByData, overrideReservedByData] = await Promise.all([
      this._userDbService.findById({
        _id: hostedById,
        dbServiceAccessOptions: overrideDbServiceAccessOptions,
      }),
      this._userDbService.findById({
        _id: reservedById,
        dbServiceAccessOptions: overrideDbServiceAccessOptions,
      }),
    ]);
    const locationData = this._locationDataHandler.getLocationData({
      hostedByData: overrideHostedByData,
      reservedByData: overrideReservedByData,
    });
    return locationData;
  };

  protected _initTemplate = async (
    optionalDbServiceInitParams: OptionalAppointmentDbServiceInitParams
  ): Promise<void> => {
    const { makePackageTransactionDbService, makeUserDbService, makeLocationDataHandler } =
      optionalDbServiceInitParams;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._userDbService = await makeUserDbService;
    this._joinType = DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
    this._locationDataHandler = makeLocationDataHandler;
  };
}

export { AppointmentDbService, AppointmentDbServiceResponse };
