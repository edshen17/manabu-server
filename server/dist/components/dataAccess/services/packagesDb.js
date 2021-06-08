"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageDbService = void 0;
const CommonDbOperations_1 = require("../abstractions/CommonDbOperations");
class PackageDbService extends CommonDbOperations_1.CommonDbOperations {
    constructor(props) {
        super(props.packageDb);
        this.defaultSelectOptions = {
            defaultSettings: {},
        };
    }
}
exports.PackageDbService = PackageDbService;
