"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.makeCacheDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const ioredis_1 = __importDefault(require("ioredis"));
const constants_1 = require("../../../../constants");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const cacheDbService_1 = require("./cacheDbService");
dayjs_1.default.extend(customParseFormat_1.default);
const clientOptions = constants_1.IS_PRODUCTION
    ? {
        host: constants_1.REDIS_HOST,
        port: constants_1.REDIS_PORT,
        password: constants_1.REDIS_PASS,
    }
    : {
        host: constants_1.REDIS_HOST_DEV,
        port: constants_1.REDIS_PORT_DEV,
        password: constants_1.REDIS_PASS_DEV,
    };
const redisClient = new ioredis_1.default(clientOptions);
exports.redisClient = redisClient;
const makeCacheDbService = new cacheDbService_1.CacheDbService().init({
    redisClient,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
    cloneDeep: clone_deep_1.default,
    dayjs: dayjs_1.default,
});
exports.makeCacheDbService = makeCacheDbService;
