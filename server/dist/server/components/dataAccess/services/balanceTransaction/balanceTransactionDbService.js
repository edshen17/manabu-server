"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceTransactionDbService = void 0;
const AbstractDbService_1 = require("../../abstractions/AbstractDbService");
const IDbService_1 = require("../../abstractions/IDbService");
class BalanceTransactionDbService extends AbstractDbService_1.AbstractDbService {
    _packageTransactionDbService;
    _getComputedProps = async (props) => {
        const { dbDoc, dbServiceAccessOptions } = props;
        const { packageTransactionId } = dbDoc;
        const packageTransactionData = await this._getDbDataById({
            dbService: this._packageTransactionDbService,
            dbServiceAccessOptions,
            _id: packageTransactionId,
        });
        const computedProps = {
            packageTransactionData,
        };
        return computedProps;
    };
    _initTemplate = async (optionalDbServiceInitParams) => {
        const { makePackageTransactionDbService } = optionalDbServiceInitParams;
        this._packageTransactionDbService = await makePackageTransactionDbService;
        this._joinType = IDbService_1.DB_SERVICE_JOIN_TYPE.LEFT_OUTER;
    };
}
exports.BalanceTransactionDbService = BalanceTransactionDbService;
