"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserDbService = void 0;
const bcryptjs_1 = require("bcryptjs");
const clone_deep_1 = __importDefault(require("clone-deep"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../../../../models/User");
const cache_1 = require("../cache");
const userDbService_1 = require("./userDbService");
const makeUserDbService = new userDbService_1.UserDbService().init({
    mongoose: mongoose_1.default,
    dbModel: User_1.User,
    comparePassword: bcryptjs_1.compareSync,
    cloneDeep: clone_deep_1.default,
    makeCacheDbService: cache_1.makeCacheDbService,
});
exports.makeUserDbService = makeUserDbService;
