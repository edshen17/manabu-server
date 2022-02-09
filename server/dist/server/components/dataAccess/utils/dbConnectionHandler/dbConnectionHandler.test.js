"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
let dbConnectionHandler;
before(async () => {
    dbConnectionHandler = await _1.makeDbConnectionHandler;
});
describe('dbConnectionHandler', () => {
    it('should connect to the db', async () => {
        await dbConnectionHandler.connect();
        (0, chai_1.expect)(mongoose_1.default.connection.readyState != 0).to.equal(true);
        await dbConnectionHandler.stop();
    });
    it('should disconnect from the db', async () => {
        await dbConnectionHandler.connect();
        await dbConnectionHandler.stop();
        (0, chai_1.expect)(mongoose_1.default.connection.readyState == 0).to.equal(true);
    });
});
