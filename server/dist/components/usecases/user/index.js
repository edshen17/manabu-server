"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePutUserUsecase = exports.makePostUserUsecase = exports.makeGetUserUsecase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../../dataAccess/index");
const getUserUsecase_1 = require("./getUserUsecase");
const postUserUsecase_1 = require("./postUserUsecase");
const putUserUsecase_1 = require("./putUserUsecase");
const emailHandler_1 = require("../../utils/email/emailHandler");
const makeGetUserUsecase = new getUserUsecase_1.GetUserUsecase().init({ makeUserDbService: index_1.makeUserDbService });
exports.makeGetUserUsecase = makeGetUserUsecase;
const makePostUserUsecase = new postUserUsecase_1.PostUserUsecase().init({
    makeUserDbService: index_1.makeUserDbService,
    makeTeacherDbService: index_1.makeTeacherDbService,
    makePackageDbService: index_1.makePackageDbService,
    makePackageTransactionDbService: index_1.makePackageTransactionDbService,
    makeMinuteBankDbService: index_1.makeMinuteBankDbService,
    makeTeacherBalanceDbService: index_1.makeTeacherBalanceDbService,
    jwt: jsonwebtoken_1.default,
    emailHandler: emailHandler_1.emailHandler,
});
exports.makePostUserUsecase = makePostUserUsecase;
const makePutUserUsecase = new putUserUsecase_1.PutUserUsecase().init({
    makeUserDbService: index_1.makeUserDbService,
    makePackageTransactionDbService: index_1.makePackageTransactionDbService,
    makeMinuteBankDbService: index_1.makeMinuteBankDbService,
});
exports.makePutUserUsecase = makePutUserUsecase;
