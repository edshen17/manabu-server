"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateUserUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const graph_1 = require("../../../dataAccess/services/graph");
const package_1 = require("../../../dataAccess/services/package");
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const teacher_1 = require("../../../dataAccess/services/teacher");
const user_1 = require("../../../dataAccess/services/user");
const package_2 = require("../../../entities/package");
const packageTransaction_2 = require("../../../entities/packageTransaction");
const teacher_2 = require("../../../entities/teacher");
const user_2 = require("../../../entities/user");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/user/query");
const cookieHandler_1 = require("../../utils/cookieHandler");
const emailHandler_1 = require("../../utils/emailHandler");
const redirectUrlBuilder_1 = require("../../utils/redirectUrlBuilder");
const createUserUsecase_1 = require("./createUserUsecase");
const makeCreateUserUsecase = new createUserUsecase_1.CreateUserUsecase().init({
    makeUserEntity: user_2.makeUserEntity,
    makePackageEntity: package_2.makePackageEntity,
    makePackageTransactionEntity: packageTransaction_2.makePackageTransactionEntity,
    makeTeacherEntity: teacher_2.makeTeacherEntity,
    makeDbService: user_1.makeUserDbService,
    makeTeacherDbService: teacher_1.makeTeacherDbService,
    makePackageDbService: package_1.makePackageDbService,
    makePackageTransactionDbService: packageTransaction_1.makePackageTransactionDbService,
    makeEmailHandler: emailHandler_1.makeEmailHandler,
    makeRedirectUrlBuilder: redirectUrlBuilder_1.makeRedirectUrlBuilder,
    makeGraphDbService: graph_1.makeGraphDbService,
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeUserQueryValidator,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
    deepEqual: deep_equal_1.default,
    makeCookieHandler: cookieHandler_1.makeCookieHandler,
});
exports.makeCreateUserUsecase = makeCreateUserUsecase;
