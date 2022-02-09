"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1 = void 0;
const express_1 = __importDefault(require("express"));
const v1_1 = require("./v1");
const v1 = express_1.default.Router();
exports.v1 = v1;
v1.use('/v1', v1_1.api);
