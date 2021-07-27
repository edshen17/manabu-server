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
          hostedById: fakeHostedBy._id,
          reservedById: fakeReservedBy._id,
        });
        expect(fakeMinuteBank.hostedById).to.deep.equal(fakeHostedBy._id);
        expect(fakeMinuteBank.reservedById).to.deep.equal(fakeReservedBy._id);
        expect(fakeMinuteBank.minuteBank).to.equal(0);
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
