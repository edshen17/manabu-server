"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentDbService = void 0;
const AbstractDbService_1 = require("../../abstractions/AbstractDbService");
const IDbService_1 = require("../../abstractions/IDbService");
class AppointmentDbService extends AbstractDbService_1.AbstractDbService {
    _packageTransactionDbService;
    _userDbService;
    _locationDataHandler;
    _getDbServiceModelViews = () => {
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
    _getComputedProps = async (props) => {
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
    _getLocationData = async (props) => {
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
    _initTemplate = async (optionalDbServiceInitParams) => {
        const { makePackageTransactionDbService, makeUserDbService, makeLocationDataHandler } = optionalDbServiceInitParams;
        this._packageTransactionDbService = await makePackageTransactionDbService;
        this._userDbService = await makeUserDbService;
        this._joinType = IDbService_1.DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
        this._locationDataHandler = makeLocationDataHandler;
    };
}
exports.AppointmentDbService = AppointmentDbService;
