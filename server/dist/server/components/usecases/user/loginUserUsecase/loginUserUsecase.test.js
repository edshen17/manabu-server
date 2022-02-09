"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const faker_1 = __importDefault(require("faker"));
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let fakeDbUserFactory;
let loginUserUsecase;
let controllerDataBuilder;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    loginUserUsecase = await _1.makeLoginUserUsecase;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
});
describe('loginUserUsecase', () => {
    describe('makeRequest', () => {
        describe('base login', () => {
            it('should log the user in', async () => {
                const fakeUserEntityData = {
                    name: faker_1.default.name.findName(),
                    password: `${faker_1.default.internet.password()}A1!`,
                    email: faker_1.default.internet.email(),
                };
                const fakeUser = await fakeDbUserFactory.createFakeDbData(fakeUserEntityData);
                const buildLoginUserControllerData = controllerDataBuilder
                    .routeData({
                    rawBody: {},
                    body: fakeUserEntityData,
                    params: {},
                    query: {},
                    headers: {},
                    endpointPath: '/base/login',
                })
                    .build();
                const loginUserRes = await loginUserUsecase.makeRequest(buildLoginUserControllerData);
                if ('user' in loginUserRes) {
                    (0, chai_1.expect)(loginUserRes.user).to.have.property('settings');
                    (0, chai_1.expect)(loginUserRes.user).to.have.property('email');
                }
            });
        });
    });
});
