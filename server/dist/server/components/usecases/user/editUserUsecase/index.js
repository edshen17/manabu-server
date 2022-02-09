"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditUserUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const user_1 = require("../../../dataAccess/services/user");
const nGramHandler_1 = require("../../../entities/utils/nGramHandler");
const query_1 = require("../../../validators/base/query");
const entity_1 = require("../../../validators/user/entity");
const params_1 = require("../../../validators/user/params");
const editUserUsecase_1 = require("./editUserUsecase");
const makeEditUserUsecase = new editUserUsecase_1.EditUserUsecase().init({
    makeDbService: user_1.makeUserDbService,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeParamsValidator: params_1.makeUserParamsValidator,
    makeEditEntityValidator: entity_1.makeUserEntityValidator,
    cloneDeep: clone_deep_1.default,
    makeNGramHandler: nGramHandler_1.makeNGramHandler,
    deepEqual: deep_equal_1.default,
    sanitizeHtml: sanitize_html_1.default,
});
exports.makeEditUserUsecase = makeEditUserUsecase;
