import { expect } from 'chai';
import { makeFakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeAvailableTimeEntity } from './index';
import { AvailableTimeEntity } from './availableTimeEntity';

let fakeDbUserFactory: FakeDbUserFactory;
let availableTimeEntity: AvailableTimeEntity;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  availableTimeEntity = await makeAvailableTimeEntity;
});

describe('minuteBank entity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should return given inputs', async () => {
        const fakeHostedBy = await fakeDbUserFactory.createFakeDbUser();
        const fakeReservedBy = await fakeDbUserFactory.createFakeDbUser();
        const fakeMinuteBank = await availableTimeEntity.build({
          hostedById: fakeHostedBy._id,
          startDate: new Date(),
          endDate: new Date(),
        });
        expect(fakeMinuteBank.hostedById).to.deep.equal(fakeHostedBy._id);
      });
    });
    context('given invalid inputs', () => {
      it('should throw an error', async () => {
        try {
          const entityData: any = {};
          const fakeMinuteBank = await availableTimeEntity.build(entityData);
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
});
