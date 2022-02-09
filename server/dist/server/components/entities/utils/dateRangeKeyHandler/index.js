"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDateRangeKeyHandler = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const dateRangeKeyHandler_1 = require("./dateRangeKeyHandler");
const makeDateRangeKeyHandler = new dateRangeKeyHandler_1.DateRangeKeyHandler().init({ dayjs: dayjs_1.default });
exports.makeDateRangeKeyHandler = makeDateRangeKeyHandler;
