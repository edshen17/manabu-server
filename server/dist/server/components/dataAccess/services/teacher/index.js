"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTeacherDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const mongoose_1 = __importDefault(require("mongoose"));
const Teacher_1 = require("../../../../models/Teacher");
const cache_1 = require("../cache");
const user_1 = require("../user");
const teacherDbService_1 = require("./teacherDbService");
const makeTeacherDbService = new teacherDbService_1.TeacherDbService().init({
    mongoose: mongoose_1.default,
    cloneDeep: clone_deep_1.default,
    makeParentDbService: user_1.makeUserDbService,
    dbModel: Teacher_1.Teacher,
    deepEqual: deep_equal_1.default,
    makeCacheDbService: cache_1.makeCacheDbService,
});
exports.makeTeacherDbService = makeTeacherDbService;
