"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const faker_1 = __importDefault(require("faker"));
const _1 = require(".");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let createUserController;
let queryStringHandler;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    createUserController = await _1.makeCreateUserController;
    queryStringHandler = queryStringHandler_1.makeQueryStringHandler;
});
describe('createUserController', () => {
    describe('makeRequest', () => {
        context('valid inputs', () => {
            it('should create a new user and return a user as well as cookies to set', async () => {
                const createUserHttpRequest = iHttpRequestBuilder
                    .body({
                    name: faker_1.default.name.findName(),
                    password: 'St0ngP@ssword!',
                    email: faker_1.default.internet.email(),
                })
                    .path('/register')
                    .build();
                const createUserRes = await createUserController.makeRequest(createUserHttpRequest);
                (0, chai_1.expect)(createUserRes.statusCode).to.equal(201);
                if ('token' in createUserRes.body) {
                    (0, chai_1.expect)(createUserRes.body).to.have.property('user');
                    (0, chai_1.expect)(createUserRes.body).to.have.property('cookies');
                }
            });
            it('should create a new teacher and return a teacher with cookies to set', async () => {
                const state = queryStringHandler.encodeQueryStringObj({
                    state: {
                        isTeacherApp: true,
                    },
                });
                const query = queryStringHandler.parseQueryString(state);
                const createUserHttpRequest = iHttpRequestBuilder
                    .body({
                    name: faker_1.default.name.findName(),
                    password: 'St0ngP@ssword!',
                    email: faker_1.default.internet.email(),
                })
                    .path('/register')
                    .query(query)
                    .build();
                const createUserRes = await createUserController.makeRequest(createUserHttpRequest);
                (0, chai_1.expect)(createUserRes.statusCode).to.equal(201);
                if ('user' in createUserRes.body) {
                    (0, chai_1.expect)(createUserRes.body.user).to.have.property('teacherData');
                    (0, chai_1.expect)(createUserRes.body).to.have.property('cookies');
                }
            });
        });
        context('invalid inputs', () => {
            it('should return an error if user creation fails', async () => {
                const createUserHttpRequest = iHttpRequestBuilder
                    .body({
                    name: faker_1.default.name.findName(),
                    password: '',
                    email: faker_1.default.internet.email(),
                })
                    .path('/register')
                    .build();
                const createUserRes = await createUserController.makeRequest(createUserHttpRequest);
                (0, chai_1.expect)(createUserRes.statusCode).to.equal(409);
            });
        });
    });
});
