"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeDbAppointmentFactory = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const dayjs_1 = __importDefault(require("dayjs"));
const appointment_1 = require("../../../entities/appointment");
const appointment_2 = require("../../services/appointment");
const fakeDbPackageTransactionFactory_1 = require("../fakeDbPackageTransactionFactory");
const fakeDbAppointmentFactory_1 = require("./fakeDbAppointmentFactory");
const makeFakeDbAppointmentFactory = new fakeDbAppointmentFactory_1.FakeDbAppointmentFactory().init({
    cloneDeep: clone_deep_1.default,
    makeEntity: appointment_1.makeAppointmentEntity,
    makeDbService: appointment_2.makeAppointmentDbService,
    makeFakeDbPackageTransactionFactory: fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory,
    dayjs: dayjs_1.default,
});
exports.makeFakeDbAppointmentFactory = makeFakeDbAppointmentFactory;
