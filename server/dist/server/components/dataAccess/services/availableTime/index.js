"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAvailableTimeDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const mongoose_1 = __importDefault(require("mongoose"));
const AvailableTime_1 = require("../../../../models/AvailableTime");
const cache_1 = require("../cache");
const availableTimeDbService_1 = require("./availableTimeDbService");
const makeAvailableTimeDbService = new availableTimeDbService_1.AvailableTimeDbService().init({
    mongoose: mongoose_1.default,
    dbModel: AvailableTime_1.AvailableTime,
    cloneDeep: clone_deep_1.default,
    makeCacheDbService: cache_1.makeCacheDbService,
});
exports.makeAvailableTimeDbService = makeAvailableTimeDbService;
