"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = __importDefault(require("express"));
const loginUserController_1 = require("../../../../../components/controllers/user/loginUserController");
const verifyEmailTokenController_1 = require("../../../../../components/controllers/user/verifyEmailTokenController");
const expressCallback_1 = require("../../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const auth = express_1.default.Router();
exports.auth = auth;
auth.get('/emailToken/:verificationToken/verify', expressCallback_1.makeRedirectExpressCallback.consume(verifyEmailTokenController_1.makeVerifyEmailTokenController));
auth.post('/base/login', expressCallback_1.makeJSONCookieExpressCallback.consume(loginUserController_1.makeLoginUserController));
auth.get('/google/login', expressCallback_1.makeCookieRedirectExpressCallback.consume(loginUserController_1.makeLoginUserController));
