import { expect } from 'chai';
import { makeGetMinuteBankUsecase } from '.';
import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbMinuteBankFactory } from '../../../dataAccess/testFixtures/fakeDbMinuteBankFactory';
import { FakeDbMinuteBankFactory } from '../../../dataAccess/testFixtures/fakeDbMinuteBankFactory/fakeDbMinuteBankFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetMinuteBankUsecase } from './getMinuteBankUsecase';

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
  getMinuteBankUsecase = await makeGetMinuteBankUsecase;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData({
    hostedById: fakeUser._id,
    reservedById: fakeUser._id,
  });
});

describe('getMinuteBankUsecase', () => {
  describe('makeRequest', () => {
    context('valid inputs', () => {
      it('should return a minuteBank given a valid inputs', async () => {
        const buildControllerData = controllerDataBuilder
          .currentAPIUser({
            userId: fakeUser._id,
            role: 'admin',
          })
          .routeData({
            query: {},
            params: {},
            body: {},
            endpointPath: '/self/minuteBanks',
          })
          .build();
        const minuteBankRes = await getMinuteBankUsecase.makeRequest(buildControllerData);
        expect(minuteBankRes).to.have.property('minuteBanks');
        expect(minuteBankRes.minuteBanks).to.be.an('array');
        expect(minuteBankRes.minuteBanks.length > 0).to.equal(true);
      });
    });
  });
});
