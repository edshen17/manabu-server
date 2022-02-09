"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSplitAvailableTimeHandler = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const availableTime_1 = require("../../../dataAccess/services/availableTime");
const availableTime_2 = require("../../../entities/availableTime");
const splitAvailableTimeHandler_1 = require("./splitAvailableTimeHandler");
const makeSplitAvailableTimeHandler = new splitAvailableTimeHandler_1.SplitAvailableTimeHandler().init({
    makeAvailableTimeDbService: availableTime_1.makeAvailableTimeDbService,
    makeAvailableTimeEntity: availableTime_2.makeAvailableTimeEntity,
    dayjs: dayjs_1.default,
});
exports.makeSplitAvailableTimeHandler = makeSplitAvailableTimeHandler;
