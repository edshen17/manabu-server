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
          hostedBy: fakeHostedBy._id.toString(),
          reservedBy: fakeReservedBy._id.toString(),
        });
        expect(fakeMinuteBank.hostedBy.toString()).to.equal(fakeHostedBy._id.toString());
        expect(fakeMinuteBank.reservedBy.toString()).to.equal(fakeReservedBy._id.toString());
        expect(fakeMinuteBank.minuteBank).to.equal(0);
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
