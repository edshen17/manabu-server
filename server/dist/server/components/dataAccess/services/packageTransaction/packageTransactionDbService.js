"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionDbService = void 0;
const AbstractDbService_1 = require("../../abstractions/AbstractDbService");
const IDbService_1 = require("../../abstractions/IDbService");
class PackageTransactionDbService extends AbstractDbService_1.AbstractDbService {
    _userDbService;
    _packageDbService;
    _getComputedProps = async (props) => {
        const { dbDoc, dbServiceAccessOptions } = props;
        const { hostedById, reservedById, packageId } = dbDoc;
        const [hostedByData, reservedByData, packageData] = await Promise.all([
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
                dbService: this._packageDbService,
                dbServiceAccessOptions,
                _id: packageId,
            }),
        ]);
        const computedProps = {
            hostedByData,
            reservedByData,
            packageData,
        };
        return computedProps;
    };
    _initTemplate = async (optionalDbServiceInitParams) => {
        const { makeUserDbService, makePackageDbService } = optionalDbServiceInitParams;
        this._userDbService = await makeUserDbService;
        this._packageDbService = await makePackageDbService;
        this._joinType = IDbService_1.DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
    };
}
exports.PackageTransactionDbService = PackageTransactionDbService;
