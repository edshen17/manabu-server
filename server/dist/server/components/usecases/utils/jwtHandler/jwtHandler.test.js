"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let jwtHandler;
let toTokenObj;
let token;
let decodedToken;
before(async () => {
    jwtHandler = await _1.makeJwtHandler;
});
beforeEach(async () => {
    toTokenObj = {
        test: 'test',
    };
    token = jwtHandler.sign({
        toTokenObj,
        expiresIn: '1d',
    });
    try {
        decodedToken = await jwtHandler.verify(token);
    }
    catch (err) {
        return;
    }
});
describe('jwtHandler', () => {
    describe('sign', () => {
        it('should convert the given object to a signed jwt', () => {
            (0, chai_1.expect)(token).to.be.a('string');
        });
    });
    describe('verify', () => {
        context('valid token', () => {
            it('should decode the token into an object', () => {
                (0, chai_1.expect)(decodedToken.test).to.equal('test');
            });
        });
        context('invalid token', () => {
            it('should throw an error', async () => {
                await jwtHandler.blacklist(token);
                let error;
                try {
                    await jwtHandler.verify(token);
                }
                catch (err) {
                    error = err;
                }
                (0, chai_1.expect)(error).to.be.an('error');
            });
        });
    });
    describe('blacklist', () => {
        it('should blacklist the token', async () => {
            const blacklistedToken = await jwtHandler.blacklist(token);
            (0, chai_1.expect)(blacklistedToken).to.equal(token);
        });
    });
});
