import { expect } from 'chai';
import { makeFakeDbAvailableTimeFactory } from '.';
import { FakeDbAvailableTimeFactory } from './fakeDbAvailableTimeFactory';

let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;

before(async () => {
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
});

describe('fakeDbAvailableTimeFactory', () => {
  describe('createFakeDbData', () => {
    it('should create an fake teacher to embed', async () => {
      const fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
      expect(fakeAvailableTime).to.have.property('hostedById');
      expect(fakeAvailableTime).to.have.property('startDate');
      expect(fakeAvailableTime).to.have.property('endDate');
    });
  });
});
