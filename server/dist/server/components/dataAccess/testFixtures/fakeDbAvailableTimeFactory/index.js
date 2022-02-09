"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeDbAvailableTimeFactory = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const dayjs_1 = __importDefault(require("dayjs"));
const availableTime_1 = require("../../../entities/availableTime");
const availableTime_2 = require("../../services/availableTime");
const fakeDbUserFactory_1 = require("../fakeDbUserFactory");
const fakeDbAvailableTimeFactory_1 = require("./fakeDbAvailableTimeFactory");
const makeFakeDbAvailableTimeFactory = new fakeDbAvailableTimeFactory_1.FakeDbAvailableTimeFactory().init({
    makeEntity: availableTime_1.makeAvailableTimeEntity,
    cloneDeep: clone_deep_1.default,
    makeDbService: availableTime_2.makeAvailableTimeDbService,
    makeFakeDbUserFactory: fakeDbUserFactory_1.makeFakeDbUserFactory,
    dayjs: dayjs_1.default,
});
exports.makeFakeDbAvailableTimeFactory = makeFakeDbAvailableTimeFactory;
