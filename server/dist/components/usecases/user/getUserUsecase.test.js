"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const faker_1 = __importDefault(require("faker"));
const index_1 = require("./index");
const initializeUser_1 = require("../testFixtures/initializeUser");
const expect = chai_1.default.expect;
let getUserUsecase;
let postUserUsecase;
let currentAPIUser;
let controllerData;
let initUserParams;
before(async () => {
    getUserUsecase = await index_1.makeGetUserUsecase;
    postUserUsecase = await index_1.makePostUserUsecase;
});
beforeEach(() => {
    controllerData = {
        currentAPIUser,
        routeData: {
            params: {},
            body: {
                email: faker_1.default.internet.email(),
                name: faker_1.default.name.findName(),
                password: 'test password',
            },
        },
    };
    initUserParams = {
        viewingAs: 'user',
        endpointPath: 'not relevant',
        isSelf: true,
        controllerData,
        getUserUsecase,
        postUserUsecase,
    };
});
context('makeRequest', async () => {
    describe("given a valid user id, should return the correct user object based on requesting user's permissions", () => {
        it('admin should see restricted properties', async () => {
            initUserParams.viewingAs = 'admin';
            const newUser = await initializeUser_1.initializeUser(initUserParams);
            expect(newUser).to.have.property('settings');
            expect(newUser).to.not.have.property('password');
        });
        it('user (not self) should see default properties', async () => {
            initUserParams.viewingAs = 'user';
            initUserParams.isSelf = false;
            const newUser = await initializeUser_1.initializeUser(initUserParams);
            expect(newUser).to.not.have.property('settings');
            expect(newUser).to.not.have.property('password');
        });
        it('user (self) should see extra properties as well as default properties', async () => {
            const newUser = await initializeUser_1.initializeUser(initUserParams);
            expect(newUser).to.have.property('settings');
            expect(newUser).to.not.have.property('password');
        });
        it('user (self on /me endpoint) should see extra properties as well as default properties', async () => {
            initUserParams.endpointPath = '/me';
            const newUser = await initializeUser_1.initializeUser(initUserParams);
            expect(newUser).to.have.property('settings');
            expect(newUser).to.not.have.property('password');
        });
    });
});
