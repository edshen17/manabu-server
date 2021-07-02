import { expect } from 'chai';
import { makeFakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeMinuteBankEntity } from './index';
import { MinuteBankEntity } from './minuteBankEntity';

let fakeDbUserFactory: FakeDbUserFactory;
let minuteBankEntity: MinuteBankEntity;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  minuteBankEntity = await makeMinuteBankEntity;
});

describe('minuteBank entity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should return given inputs', async () => {
        const fakeHostedBy = await fakeDbUserFactory.createFakeDbUser();
        const fakeReservedBy = await fakeDbUserFactory.createFakeDbUser();
        const fakeMinuteBank = await minuteBankEntity.build({
          hostedBy: fakeHostedBy._id,
          reservedBy: fakeReservedBy._id,
          minuteBank: 5,
        });
        expect(fakeMinuteBank.hostedBy).to.equal(fakeHostedBy._id);
        expect(fakeMinuteBank.reservedBy).to.equal(fakeReservedBy._id);
        expect(fakeMinuteBank.minuteBank).to.equal(5);
        expect(fakeMinuteBank.hostedByData).to.deep.equal(fakeHostedBy);
        expect(fakeMinuteBank.reservedByData).to.deep.equal(fakeReservedBy);
      });
    });
    context('given invalid inputs', () => {
      it('should throw an error', async () => {
        try {
          const entityData: any = {};
          const fakeMinuteBank = await minuteBankEntity.build(entityData);
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
});
