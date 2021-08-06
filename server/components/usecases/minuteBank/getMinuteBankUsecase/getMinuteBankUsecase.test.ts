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
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';

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
          .endpointPath('/self/minuteBanks')
          .currentAPIUser({
            userId: fakeUser._id,
            role: 'admin',
          })
          .build();
        const minuteBankRes = await getMinuteBankUsecase.makeRequest(buildControllerData);
        expect(minuteBankRes).to.have.property('minuteBanks');
        expect(minuteBankRes.minuteBanks).to.be.an('array');
        expect(minuteBankRes.minuteBanks.length > 0).to.equal(true);
      });
    });
    context('invalid inputs', () => {});
  });
});
