"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGraphDbService = void 0;
const redisgraph_js_1 = require("redisgraph.js");
const cache_1 = require("../cache");
const graphDbService_1 = require("./graphDbService");
const redisGraph = new redisgraph_js_1.Graph('social-network', cache_1.redisClient);
const makeGraphDbService = new graphDbService_1.GraphDbService().init({ redisGraph });
exports.makeGraphDbService = makeGraphDbService;
