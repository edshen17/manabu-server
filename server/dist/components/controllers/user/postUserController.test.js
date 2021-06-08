"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const createUser_1 = require("../testFixtures/createUser");
const expect = chai_1.default.expect;
describe('getUserController', () => {
    describe('makeRequest', async () => {
        it('should create a new user and return a jwt', async () => {
            const controllerRes = await createUser_1.createUser();
            expect(controllerRes.statusCode).to.equal(200);
            expect(controllerRes.body.token).to.be.a('string');
        });
    });
});
