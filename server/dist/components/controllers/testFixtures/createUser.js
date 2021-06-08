"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const faker_1 = __importDefault(require("faker"));
const index_1 = require("../user/index");
const createUser = async () => {
    const postUserController = await index_1.makePostUserController;
    const httpRequest = {
        body: {
            name: faker_1.default.name.findName(),
            password: 'password',
            email: faker_1.default.internet.email(),
        },
        path: '/register',
        query: {},
        params: {},
        currentAPIUser: {
            userId: undefined,
            role: 'user',
            isVerified: false,
        },
    };
    return await postUserController.makeRequest(httpRequest);
};
exports.createUser = createUser;
