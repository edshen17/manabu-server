"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeJwtHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cache_1 = require("../../../dataAccess/services/cache");
const jwtHandler_1 = require("./jwtHandler");
const makeJwtHandler = new jwtHandler_1.JwtHandler().init({ jwt: jsonwebtoken_1.default, makeCacheDbService: cache_1.makeCacheDbService });
exports.makeJwtHandler = makeJwtHandler;
