import { expect } from 'chai';
import { GetMinuteBankUsecase } from './getMinuteBankUsecase';
import { makeGetMinuteBankUsecase } from '.';
import { FakeDbMinuteBankFactory } from '../../../dataAccess/testFixtures/fakeDbMinuteBankFactory/fakeDbMinuteBankFactory';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { makeFakeDbMinuteBankFactory } from '../../../dataAccess/testFixtures/fakeDbMinuteBankFactory';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { JoinedUserDoc } from '../../../../models/User';

let getMinuteBankUsecase: GetMinuteBankUsecase;
let fakeDbMinuteBankFactory: FakeDbMinuteBankFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let fakeMinuteBank: MinuteBankDoc;
let fakeUser: JoinedUserDoc;

before(async () => {
  fakeDbMinuteBankFactory = await makeFakeDbMinuteBankFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData({
    hostedById: fakeUser._id.toString(),
    reservedById: fakeUser._id.toString(),
  });
  getMinuteBankUsecase = await makeGetMinuteBankUsecase;
});

describe('getMinuteBankUsecase', () => {
  describe('makeRequest', () => {
    it('should return a minuteBank given a valid inputs', async () => {
      const buildControllerData = controllerDataBuilder
        .endpointPath('/self/minuteBanks')
        .currentAPIUser({
          userId: fakeUser._id.toString(),
          role: 'admin',
        })
        .build();
      const minuteBankRes = await getMinuteBankUsecase.makeRequest(buildControllerData);
      if ('minuteBanks' in minuteBankRes) {
        expect(minuteBankRes).to.have.property('minuteBanks');
        expect(minuteBankRes.minuteBanks).to.be.an('array');
        expect(minuteBankRes.minuteBanks.length > 0).to.equal(true);
      }
    });
    // invalid input no current api user
  });
});
