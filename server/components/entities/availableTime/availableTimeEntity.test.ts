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

describe('availableTimeEntity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should return given inputs', async () => {
        const fakeHostedBy = await fakeDbUserFactory.createFakeDbUser();
        const endDate = new Date();
        endDate.setMinutes(endDate.getMinutes() + 30);
        const fakeAvailableTime = await availableTimeEntity.build({
          hostedById: fakeHostedBy._id,
          startDate: new Date(),
          endDate,
        });
        expect(fakeAvailableTime.hostedById).to.deep.equal(fakeHostedBy._id);
      });
    });
    context('given invalid inputs', () => {
      it('should throw an error', async () => {
        try {
          const entityData: any = {};
          const fakeAvailableTime = await availableTimeEntity.build(entityData);
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
});
