"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeQueryStringHandler = void 0;
const query_string_1 = __importDefault(require("query-string"));
const queryStringHandler_1 = require("./queryStringHandler");
const makeQueryStringHandler = new queryStringHandler_1.QueryStringHandler().init({
    queryStringLib: query_string_1.default,
});
exports.makeQueryStringHandler = makeQueryStringHandler;
