import { expect } from 'chai';
import { makeMinuteBankDbService } from '.';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { makeFakeDbMinuteBankFactory } from '../../testFixtures/fakeDbMinuteBankFactory';
import { FakeDbMinuteBankFactory } from '../../testFixtures/fakeDbMinuteBankFactory/fakeDbMinuteBankFactory';
import { MinuteBankDbService } from './minuteBankDbService';

let minuteBankDbService: MinuteBankDbService;
let fakeDbMinuteBankFactory: FakeDbMinuteBankFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  minuteBankDbService = await makeMinuteBankDbService;
  fakeDbMinuteBankFactory = await makeFakeDbMinuteBankFactory;
});

beforeEach(() => {
  dbServiceAccessOptions = fakeDbMinuteBankFactory.getDefaultAccessOptions();
});

describe('minuteBankDbService', () => {
  describe('findById, findOne, find', () => {
    it('should find the correct minuteBank with a restricted view on user data (user, not self)', async () => {
      const newMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData({ minuteBank: 0 });
      const findMinuteBanks = await minuteBankDbService.find({
        searchQuery: { _id: newMinuteBank._id },
        dbServiceAccessOptions,
      });
      const findByIdMinuteBank = await minuteBankDbService.findById({
        _id: newMinuteBank._id,
        dbServiceAccessOptions,
      });
      const findOneMinuteBank = await minuteBankDbService.findOne({
        searchQuery: { _id: newMinuteBank._id },
        dbServiceAccessOptions,
      });

      expect(findMinuteBanks.length == 1).to.equal(true);
      expect(findMinuteBanks[0]).to.deep.equal(findByIdMinuteBank);
      expect(findByIdMinuteBank).to.deep.equal(findOneMinuteBank);
      expect(findByIdMinuteBank).to.deep.equal(newMinuteBank);
      expect(findByIdMinuteBank.hostedByData).to.not.have.property('email');
      expect(findByIdMinuteBank.hostedByData).to.not.have.property('password');
      expect(findByIdMinuteBank.reservedByData).to.not.have.property('email');
      expect(findByIdMinuteBank.reservedByData).to.not.have.property('password');
    });
    it('should find the correct minuteBank with a restricted view on user data, even if self (admin, self)', async () => {
      dbServiceAccessOptions.currentAPIUserRole = 'admin';
      dbServiceAccessOptions.isSelf = true;
      const newMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData({ minuteBank: 0 });
      const foundMinuteBank = await minuteBankDbService.findById({
        _id: newMinuteBank._id,
        dbServiceAccessOptions,
      });
      expect(foundMinuteBank).to.deep.equal(newMinuteBank);
      expect(foundMinuteBank.hostedByData).to.not.have.property('email');
      expect(foundMinuteBank.hostedByData).to.not.have.property('password');
      expect(foundMinuteBank.reservedByData).to.not.have.property('email');
      expect(foundMinuteBank.reservedByData).to.not.have.property('password');
    });
    describe('update', async () => {
      const newMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData({ minuteBank: 0 });
      const updatedMinuteBank = await minuteBankDbService.findOneAndUpdate({
        updateParams: { minuteBank: 10 },
        dbServiceAccessOptions,
      });
      expect(newMinuteBank).to.not.deep.equal(updatedMinuteBank);
      expect(newMinuteBank.minuteBank).to.equal(10);
    });
  });
});
