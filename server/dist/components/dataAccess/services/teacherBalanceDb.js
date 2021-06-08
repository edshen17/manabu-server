"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherBalanceDbService = void 0;
const CommonDbOperations_1 = require("../abstractions/CommonDbOperations");
class TeacherBalanceDbService extends CommonDbOperations_1.CommonDbOperations {
    constructor(props) {
        super(props.teacherBalanceDb);
        this.defaultSelectOptions = {
            defaultSettings: {},
        };
    }
}
exports.TeacherBalanceDbService = TeacherBalanceDbService;
