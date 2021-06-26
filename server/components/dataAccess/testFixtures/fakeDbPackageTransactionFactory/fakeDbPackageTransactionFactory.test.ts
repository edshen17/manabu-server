import { expect } from 'chai';
import { makeFakeDbPackageTransactionFactory } from '.';
import { FakeDbPackageTransactionFactory } from './fakeDbPackageTransactionFactory';

let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;

before(async () => {
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

describe('fakeDbPackageTransaction', () => {
  describe('createFakeDbData', () => {
    it('should create a fake package transaction using data from a fake teacher', async () => {
      const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
      expect(fakePackageTransaction._id.toString().length).to.equal(24);
    });
  });
});
