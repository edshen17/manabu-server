"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEmailHandler = void 0;
const fs_1 = __importDefault(require("fs"));
const mjml_1 = __importDefault(require("mjml"));
const path_1 = require("path");
const vue_1 = __importDefault(require("vue"));
const vue_server_renderer_1 = require("vue-server-renderer");
const user_1 = require("../../../dataAccess/services/user");
const emailHandler_1 = require("./emailHandler");
const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const makeEmailHandler = new emailHandler_1.EmailHandler().init({
    fs: fs_1.default,
    makeUserDbService: user_1.makeUserDbService,
    vue: vue_1.default,
    createRenderer: vue_server_renderer_1.createRenderer,
    mjml: mjml_1.default,
    join: path_1.join,
    sendgrid,
});
exports.makeEmailHandler = makeEmailHandler;
