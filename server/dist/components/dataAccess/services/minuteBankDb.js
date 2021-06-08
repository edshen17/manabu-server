"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinuteBankDbService = void 0;
const CommonDbOperations_1 = require("../abstractions/CommonDbOperations");
class MinuteBankDbService extends CommonDbOperations_1.CommonDbOperations {
    constructor(props) {
        super(props.minuteBankDb);
        this.defaultSelectOptions = {
            defaultSettings: {},
        };
    }
}
exports.MinuteBankDbService = MinuteBankDbService;
