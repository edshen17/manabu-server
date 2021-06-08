"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherDbService = void 0;
const CommonDbOperations_1 = require("../abstractions/CommonDbOperations");
class TeacherDbService extends CommonDbOperations_1.CommonDbOperations {
    constructor(props) {
        super(props.teacherDb);
        this.findById = async (params) => {
            const { _id, accessOptions } = params;
            const asyncCallback = this.findOne({ searchQuery: { userId: _id }, accessOptions });
            return await this._grantAccess(accessOptions, asyncCallback);
        };
        this.defaultSelectOptions = {
            defaultSettings: {
                licensePath: 0,
            },
            adminSettings: {},
        };
    }
}
exports.TeacherDbService = TeacherDbService;
