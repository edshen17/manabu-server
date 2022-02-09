"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeVerifyEmailTokenUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const user_1 = require("../../../dataAccess/services/user");
const query_1 = require("../../../validators/base/query");
const params_1 = require("../../../validators/user/params");
const redirectUrlBuilder_1 = require("../../utils/redirectUrlBuilder");
const verifyEmailTokenUsecase_1 = require("./verifyEmailTokenUsecase");
const makeVerifyEmailTokenUsecase = new verifyEmailTokenUsecase_1.VerifyEmailTokenUsecase().init({
    makeDbService: user_1.makeUserDbService,
    makeRedirectUrlBuilder: redirectUrlBuilder_1.makeRedirectUrlBuilder,
    makeParamsValidator: params_1.makeUserParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
});
exports.makeVerifyEmailTokenUsecase = makeVerifyEmailTokenUsecase;
