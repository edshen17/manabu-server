"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDbOptions = void 0;
require("dotenv/config");
const mongoDbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    ignoreUndefined: true,
    useCreateIndex: true,
    readPreference: 'nearest',
};
exports.mongoDbOptions = mongoDbOptions;
