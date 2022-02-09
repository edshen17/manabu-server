"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetUserUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const user_1 = require("../../../dataAccess/services/user");
const query_1 = require("../../../validators/base/query");
const params_1 = require("../../../validators/user/params");
const cookieHandler_1 = require("../../utils/cookieHandler");
const jwtHandler_1 = require("../../utils/jwtHandler");
const getUserUsecase_1 = require("./getUserUsecase");
const makeGetUserUsecase = new getUserUsecase_1.GetUserUsecase().init({
    makeDbService: user_1.makeUserDbService,
    makeParamsValidator: params_1.makeUserParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    makeCookieHandler: cookieHandler_1.makeCookieHandler,
    makeJwtHandler: jwtHandler_1.makeJwtHandler,
});
exports.makeGetUserUsecase = makeGetUserUsecase;
