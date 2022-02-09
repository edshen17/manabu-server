"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToObjectId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const convertStringToObjectId = (objectIdString) => {
    const objectId = new mongoose_1.default.Types.ObjectId(objectIdString);
    return objectId;
};
exports.convertStringToObjectId = convertStringToObjectId;
