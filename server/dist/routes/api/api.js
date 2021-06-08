"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../../components/controllers/user");
const index_1 = require("../../components/expressCallback/index");
const router = express_1.default.Router();
const VerifyToken = require('../../components/VerifyToken'); // TODO: turn into ts + import statement
router.get('/user/:uId', VerifyToken, index_1.makeExpressCallback(user_1.makeGetUserController));
router.post('/register', index_1.makeExpressCallback(user_1.makePostUserController));
module.exports = router;
