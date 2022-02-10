"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginUserUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const googleapis_1 = require("googleapis");
const user_1 = require("../../../dataAccess/services/user");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/user/query");
const cookieHandler_1 = require("../../utils/cookieHandler");
const redirectUrlBuilder_1 = require("../../utils/redirectUrlBuilder");
const createUserUsecase_1 = require("../createUserUsecase");
const loginUserUsecase_1 = require("./loginUserUsecase");
const makeLoginUserUsecase = new loginUserUsecase_1.LoginUserUsecase().init({
    makeDbService: user_1.makeUserDbService,
    makeCreateUserUsecase: createUserUsecase_1.makeCreateUserUsecase,
    google: googleapis_1.google,
    makeRedirectUrlBuilder: redirectUrlBuilder_1.makeRedirectUrlBuilder,
    cloneDeep: clone_deep_1.default,
    makeQueryValidator: query_1.makeUserQueryValidator,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    deepEqual: deep_equal_1.default,
    makeCookieHandler: cookieHandler_1.makeCookieHandler,
});
exports.makeLoginUserUsecase = makeLoginUserUsecase;
