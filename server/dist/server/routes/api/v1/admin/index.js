"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = void 0;
const express_1 = __importDefault(require("express"));
const getPendingTeachersController_1 = require("../../../../components/controllers/teacher/getPendingTeachersController");
const expressCallback_1 = require("../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const admin = express_1.default.Router();
exports.admin = admin;
admin.get('/pendingTeachers', expressCallback_1.makeJSONExpressCallback.consume(getPendingTeachersController_1.makeGetPendingTeachersController));
