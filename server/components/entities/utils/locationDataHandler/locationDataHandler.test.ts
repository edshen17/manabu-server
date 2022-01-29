import { expect } from 'chai';
import { makeLocationDataHandler } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { LocationData, LocationDataHandler } from './locationDataHandler';

let locationDataHandler: LocationDataHandler;
let userDbService: UserDbService;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let overrideFakeUser: JoinedUserDoc;
let overrideFakeTeacher: JoinedUserDoc;
let dbServiceAccessOptions: DbServiceAccessOptions;
let locationData: LocationData;

before(async () => {
  locationDataHandler = makeLocationDataHandler;
  userDbService = await makeUserDbService;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  dbServiceAccessOptions = userDbService.getOverrideDbServiceAccessOptions();
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  overrideFakeUser = await userDbService.findById({
    _id: fakeUser._id,
    dbServiceAccessOptions,
  });
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  overrideFakeTeacher = await userDbService.findById({
    _id: fakeTeacher._id,
    dbServiceAccessOptions,
  });
  locationData = locationDataHandler.getLocationData({
    hostedByData: overrideFakeTeacher,
    reservedByData: overrideFakeUser,
  });
});

describe('locationDataHandler', () => {
  describe('getLocationData', () => {
    context('valid inputs', () => {
      context('same contact method', async () => {
        it('should return locationData with a matched contact method', () => {
          expect(locationData).to.have.property('hostedByContactMethod');
          expect(locationData).to.have.property('reservedByContactMethod');
          expect(locationData.name).to.not.equal('alternative');
        });
      });
      context('different contact method', () => {
        it('should return locationData with an alternative contact method', () => {
          overrideFakeTeacher.contactMethods[0].name = 'Skype';
          locationData = locationDataHandler.getLocationData({
            hostedByData: overrideFakeTeacher,
            reservedByData: overrideFakeUser,
          });
          expect(locationData.name).to.equal('alternative');
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', () => {
        try {
          locationDataHandler.getLocationData({
            hostedByData: fakeTeacher,
            reservedByData: fakeUser,
          });
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
});
