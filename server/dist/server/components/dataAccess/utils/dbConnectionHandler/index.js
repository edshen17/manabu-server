"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDbConnectionHandler = void 0;
const mongodb_memory_server_core_1 = require("mongodb-memory-server-core");
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnectionHandler_1 = require("./dbConnectionHandler");
const makeDbConnectionHandler = new dbConnectionHandler_1.DbConnectionHandler().init({
    mongoose: mongoose_1.default,
    MongoMemoryReplSet: mongodb_memory_server_core_1.MongoMemoryReplSet,
});
exports.makeDbConnectionHandler = makeDbConnectionHandler;
