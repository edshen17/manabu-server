"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionDbService = void 0;
const CommonDbOperations_1 = require("../abstractions/CommonDbOperations");
class PackageTransactionDbService extends CommonDbOperations_1.CommonDbOperations {
    constructor(props) {
        super(props.packageTransactionDb);
        this.defaultSelectOptions = {
            defaultSettings: {},
        };
    }
}
exports.PackageTransactionDbService = PackageTransactionDbService;
