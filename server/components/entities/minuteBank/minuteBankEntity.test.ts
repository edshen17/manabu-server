import chai from 'chai';
import { makeFakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';

import { makeMinuteBankEntity } from './index';

let fakeDbUserFactory: FakeDbUserFactory;
const expect = chai.expect;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

context('minuteBank entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', async () => {
        const minuteBankEntity = await makeMinuteBankEntity;
        const fakeHostedBy = await fakeDbUserFactory.createFakeDbUser();
        const fakeReservedBy = await fakeDbUserFactory.createFakeDbUser();
        const testMinuteBank = await minuteBankEntity.build({
          hostedBy: fakeHostedBy._id,
          reservedBy: fakeReservedBy._id,
          minuteBank: 5,
        });
        expect(testMinuteBank.hostedBy).to.equal(fakeHostedBy._id);
        expect(testMinuteBank.reservedBy).to.equal(fakeReservedBy._id);
        expect(testMinuteBank.minuteBank).to.equal(5);
        expect(testMinuteBank).to.have.property('hostedByData');
        expect(testMinuteBank).to.have.property('reservedByData');
      });
    });
  });
});
