"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mochaHooks = exports.mochaGlobalSetup = void 0;
const dbConnectionHandler_1 = require("./server/components/dataAccess/utils/dbConnectionHandler");
let dbConnectionHandler;
const mochaHooks = {
    async beforeAll() {
        dbConnectionHandler = await dbConnectionHandler_1.makeDbConnectionHandler;
        await dbConnectionHandler.connect();
    },
    async afterAll() {
        await dbConnectionHandler.stop();
    },
};
exports.mochaHooks = mochaHooks;
const mochaGlobalSetup = async () => {
    const ENV_VARIABLES = require('dotenv').config();
};
exports.mochaGlobalSetup = mochaGlobalSetup;
