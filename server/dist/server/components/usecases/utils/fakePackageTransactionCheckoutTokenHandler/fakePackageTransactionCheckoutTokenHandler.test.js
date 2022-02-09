"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let fakePackageTransactionCheckoutTokenHandler;
before(async () => {
    fakePackageTransactionCheckoutTokenHandler = await _1.makeFakePackageTransactionCheckoutTokenHandler;
});
describe('fakePackageTransactionCheckoutTokenHandler', () => {
    it('should return a valid checkout token', async () => {
        const { token } = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
        (0, chai_1.expect)(token).to.be.a('string');
        (0, chai_1.expect)(token.length > 0).to.equal(true);
    });
});
