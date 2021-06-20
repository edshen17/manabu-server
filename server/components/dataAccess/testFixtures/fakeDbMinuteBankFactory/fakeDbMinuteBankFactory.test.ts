import chai from 'chai';
import { makeFakeDbMinuteBankFactory } from '.';
import { makeMinuteBankDbService } from '../../services/minuteBank';
import { MinuteBankDbService } from '../../services/minuteBank/minuteBankService';
import { FakeDbMinuteBankFactory } from './fakeDbMinuteBankFactory';
import { makeUserDbService } from '../../services/user';
import { UserDbService } from '../../services/user/userDbService';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

const expect = chai.expect;
let fakeDbMinuteBankFactory: FakeDbMinuteBankFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let minuteBankDbService: MinuteBankDbService;
let userDbService: UserDbService;

before(async () => {
  fakeDbMinuteBankFactory = await makeFakeDbMinuteBankFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  minuteBankDbService = await makeMinuteBankDbService;
  userDbService = await makeUserDbService;
});

describe('fakeDbMinuteBankFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake db minute bank with user data', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      const fakeDbMinutebank = await fakeDbMinuteBankFactory.createFakeDbData({
        minuteBank: 5,
        hostedBy: fakeUser._id,
        reservedBy: fakeUser._id,
      });
      expect(fakeDbMinutebank).to.have.property('hostedBy');
      expect(fakeDbMinutebank.hostedByData).to.deep.equal(fakeUser);
      expect(fakeDbMinutebank.reservedByData).to.deep.equal(fakeUser);
    });
  });
});
