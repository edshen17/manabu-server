import { expect } from 'chai';
import { makeFakePackageTransactionCheckoutTokenHandler } from '.';
import { FakePackageTransactionCheckoutTokenHandler } from './fakePackageTransactionCheckoutTokenHandler';

let fakePackageTransactionCheckoutTokenHandler: FakePackageTransactionCheckoutTokenHandler;

before(async () => {
  fakePackageTransactionCheckoutTokenHandler = await makeFakePackageTransactionCheckoutTokenHandler;
});

describe('fakePackageTransactionCheckoutTokenHandler', () => {
  it('should return a valid checkout token', async () => {
    const { token } = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
    expect(token).to.be.a('string');
    expect(token.length > 0).to.equal(true);
  });
});
