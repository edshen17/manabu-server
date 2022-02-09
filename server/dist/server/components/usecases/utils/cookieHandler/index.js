"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCookieHandler = void 0;
const jwtHandler_1 = require("../jwtHandler");
const cookieHandler_1 = require("./cookieHandler");
const makeCookieHandler = new cookieHandler_1.CookieHandler().init({
    makeJwtHandler: jwtHandler_1.makeJwtHandler,
});
exports.makeCookieHandler = makeCookieHandler;
