"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teachers = void 0;
const express_1 = __importDefault(require("express"));
const editTeacherController_1 = require("../../../../components/controllers/teacher/editTeacherController");
const getTeachersController_1 = require("../../../../components/controllers/teacher/getTeachersController");
const expressCallback_1 = require("../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const teachers = express_1.default.Router();
exports.teachers = teachers;
teachers.get('/', expressCallback_1.makeJSONExpressCallback.consume(getTeachersController_1.makeGetTeachersController));
teachers.patch('/:teacherId', expressCallback_1.makeJSONExpressCallback.consume(editTeacherController_1.makeEditTeacherController));
