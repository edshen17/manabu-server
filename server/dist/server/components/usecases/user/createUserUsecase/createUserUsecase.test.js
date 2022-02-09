"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const faker_1 = __importDefault(require("faker"));
const _1 = require(".");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let createUserUsecase;
let routeData;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createUserUsecase = await _1.makeCreateUserUsecase;
});
beforeEach(() => {
    routeData = {
        rawBody: {},
        headers: {},
        params: {},
        body: {
            name: faker_1.default.name.findName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password(),
        },
        query: {
            state: {
                isTeacherApp: true,
            },
        },
        endpointPath: '',
    };
});
describe('createUserUsecase', () => {
    describe('makeRequest', () => {
        const createUser = async () => {
            const controllerData = controllerDataBuilder.routeData(routeData).build();
            const createUserRes = await createUserUsecase.makeRequest(controllerData);
            return createUserRes;
        };
        const testUserError = async () => {
            let error;
            try {
                await createUser();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if restricted fields found in body', async () => {
                    const routeDataBody = routeData.body;
                    routeDataBody._id = 'some id';
                    routeDataBody.role = 'admin';
                    routeDataBody.dateRegistered = new Date();
                    routeDataBody.verificationToken = 'new token';
                    await testUserError();
                });
            });
            context('valid inputs', () => {
                const validResOutput = (createUserRes) => {
                    (0, chai_1.expect)(createUserRes).to.have.property('user');
                    (0, chai_1.expect)(createUserRes.user).to.not.equal(null);
                    (0, chai_1.expect)(createUserRes).to.have.property('redirectUrl');
                    (0, chai_1.expect)(createUserRes.redirectUrl).to.not.equal(null);
                    (0, chai_1.expect)(createUserRes).to.have.property('cookies');
                    (0, chai_1.expect)(createUserRes.cookies).to.not.equal(null);
                };
                it('should return a new user, auth cookies, and a redirect url', async () => {
                    const createUserRes = await createUser();
                    validResOutput(createUserRes);
                });
                it('should return a joined user, auth cookies, and a redirect url', async () => {
                    const createUserRes = await createUser();
                    const savedDbUser = createUserRes.user;
                    (0, chai_1.expect)(savedDbUser).to.have.property('settings');
                    (0, chai_1.expect)(savedDbUser).to.not.have.property('password');
                    (0, chai_1.expect)(savedDbUser.teacherData).to.have.property('licenseUrl');
                });
            });
        });
    });
});
