"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAppointmentDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const mongoose_1 = __importDefault(require("mongoose"));
const Appointment_1 = require("../../../../models/Appointment");
const locationDataHandler_1 = require("../../../entities/utils/locationDataHandler");
const cache_1 = require("../cache");
const packageTransaction_1 = require("../packageTransaction");
const user_1 = require("../user");
const appointmentDbService_1 = require("./appointmentDbService");
const makeAppointmentDbService = new appointmentDbService_1.AppointmentDbService().init({
    mongoose: mongoose_1.default,
    dbModel: Appointment_1.Appointment,
    cloneDeep: clone_deep_1.default,
    makePackageTransactionDbService: packageTransaction_1.makePackageTransactionDbService,
    makeCacheDbService: cache_1.makeCacheDbService,
    makeUserDbService: user_1.makeUserDbService,
    makeLocationDataHandler: locationDataHandler_1.makeLocationDataHandler,
});
exports.makeAppointmentDbService = makeAppointmentDbService;
