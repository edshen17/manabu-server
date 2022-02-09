"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRedirectUrlBuilder = void 0;
const queryStringHandler_1 = require("../queryStringHandler");
const redirectUrlBuilder_1 = require("./redirectUrlBuilder");
const makeRedirectUrlBuilder = new redirectUrlBuilder_1.RedirectUrlBuilder().init({ makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler });
exports.makeRedirectUrlBuilder = makeRedirectUrlBuilder;
