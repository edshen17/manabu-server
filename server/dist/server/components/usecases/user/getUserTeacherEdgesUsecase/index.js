"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetUserTeacherEdgesUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const graph_1 = require("../../../dataAccess/services/graph");
const user_1 = require("../../../dataAccess/services/user");
const query_1 = require("../../../validators/base/query");
const params_1 = require("../../../validators/user/params");
const getUserTeacherEdgesUsecase_1 = require("./getUserTeacherEdgesUsecase");
const makeGetUserTeacherEdgesUsecase = new getUserTeacherEdgesUsecase_1.GetUserTeacherEdgesUsecase().init({
    makeDbService: user_1.makeUserDbService,
    makeParamsValidator: params_1.makeUserParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    makeGraphDbService: graph_1.makeGraphDbService,
});
exports.makeGetUserTeacherEdgesUsecase = makeGetUserTeacherEdgesUsecase;
