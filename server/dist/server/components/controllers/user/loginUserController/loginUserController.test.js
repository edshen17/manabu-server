"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const faker_1 = __importDefault(require("faker"));
const _1 = require(".");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let fakeDbUserFactory;
let iHttpRequestBuilder;
let loginUserController;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    loginUserController = await _1.makeLoginUserController;
});
describe('loginUserController', () => {
    describe('makeRequest', () => {
        it('should login the user given a valid username and password', async () => {
            const fakeUserEntityData = {
                name: faker_1.default.name.findName(),
                password: `${faker_1.default.internet.password()}A1!`,
                email: faker_1.default.internet.email(),
            };
            const fakeUser = await fakeDbUserFactory.createFakeDbData(fakeUserEntityData);
            const loginUserHttpRequest = iHttpRequestBuilder
                .path('/base/login')
                .body(fakeUserEntityData)
                .build();
            const loginUserRes = await loginUserController.makeRequest(loginUserHttpRequest);
            (0, chai_1.expect)(loginUserRes.statusCode).to.equal(200);
            if ('user' in loginUserRes.body) {
                (0, chai_1.expect)(loginUserRes.body.user).to.have.property('email');
                (0, chai_1.expect)(loginUserRes.body.user).to.have.property('settings');
            }
        });
    });
});
