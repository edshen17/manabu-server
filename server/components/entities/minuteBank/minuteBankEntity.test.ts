import chai from 'chai';
import { makeFakeDbUserGenerator } from '../../dataAccess/testFixtures/fakeDbUserGenerator';
import { FakeDBUserGenerator } from '../../dataAccess/testFixtures/fakeDbUserGenerator/fakeDbUserGenerator';
import { makeMinuteBankEntity } from './index';

let fakeDbUserGenerator: FakeDBUserGenerator;
const expect = chai.expect;

before(async () => {
  fakeDbUserGenerator = await makeFakeDbUserGenerator;
});

context('minuteBank entity', () => {
  describe('build', () => {
    describe('given valid inputs', () => {
      it('should return given inputs', async () => {
        const minuteBankEntity = await makeMinuteBankEntity;
        const fakeHostedBy = await fakeDbUserGenerator.createFakeDbUser();
        const fakeReservedBy = await fakeDbUserGenerator.createFakeDbUser();
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
