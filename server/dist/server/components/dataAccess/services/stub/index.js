"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStubDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const mongoose_1 = __importDefault(require("mongoose"));
const cache_1 = require("../cache");
const stubDbService_1 = require("./stubDbService");
const makeStubDbService = new stubDbService_1.StubDbService().init({
    mongoose: mongoose_1.default,
    dbModel: undefined,
    cloneDeep: clone_deep_1.default,
    makeCacheDbService: cache_1.makeCacheDbService,
});
exports.makeStubDbService = makeStubDbService;
