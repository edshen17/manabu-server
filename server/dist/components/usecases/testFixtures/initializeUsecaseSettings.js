"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUsecaseSettings = void 0;
const faker_1 = __importDefault(require("faker"));
const user_1 = require("../user");
const initializeUsecaseSettings = async () => {
    const getUserUsecase = await user_1.makeGetUserUsecase;
    const postUserUsecase = await user_1.makePostUserUsecase;
    const putUserUsecase = await user_1.makePutUserUsecase;
    const currentAPIUser = {
        userId: undefined,
        role: 'user',
        isVerified: true,
    };
    const routeData = {
        params: {},
        body: {
            email: faker_1.default.internet.email(),
            name: faker_1.default.name.findName(),
            password: 'test password',
        },
    };
    const controllerData = {
        currentAPIUser,
        routeData,
    };
    const initUserParams = {
        viewingAs: 'user',
        endpointPath: undefined,
        isSelf: true,
        controllerData,
        getUserUsecase,
        postUserUsecase,
        putUserUsecase,
    };
    return initUserParams;
};
exports.initializeUsecaseSettings = initializeUsecaseSettings;
