import { expect } from 'chai';
import { makeCookieHandler } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CookieHandler } from './cookieHandler';

let cookieHandler: CookieHandler;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeUser: JoinedUserDoc;

before(async () => {
  cookieHandler = await makeCookieHandler;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
});

describe('jwtHandler', () => {
  describe('splitLoginCookies', () => {
    it('should return a split jwt', () => {
      const cookieArr = cookieHandler.splitLoginCookies(fakeUser);
      expect(cookieArr.length).to.equal(2);
      expect(cookieArr[0].name).to.equal('hp');
    });
  });
});
