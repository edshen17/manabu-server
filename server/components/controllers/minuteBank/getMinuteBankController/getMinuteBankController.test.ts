import { expect } from 'chai';
import { makeGetMinuteBankController } from '.';
import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbMinuteBankFactory } from '../../../dataAccess/testFixtures/fakeDbMinuteBankFactory';
import { FakeDbMinuteBankFactory } from '../../../dataAccess/testFixtures/fakeDbMinuteBankFactory/fakeDbMinuteBankFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetMinuteBankController } from './getMinuteBankController';

let fakeDbMinuteBankFactory: FakeDbMinuteBankFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let getMinuteBankController: GetMinuteBankController;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let fakeMinuteBank: MinuteBankDoc;
let iHttpRequestBuilder: IHttpRequestBuilder;

before(async () => {
  fakeDbMinuteBankFactory = await makeFakeDbMinuteBankFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  getMinuteBankController = await makeGetMinuteBankController;
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithPackages();
  fakeMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData({
    hostedById: fakeTeacher._id,
    reservedById: fakeUser._id,
  });
  iHttpRequestBuilder = makeIHttpRequestBuilder;
});

describe('getMinuteBankController', () => {
  describe('makeRequest', () => {
    it('should get the minute bank (related party -- hostedById)', async () => {
      const getMinuteBankHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeUser._id,
          role: fakeUser.role,
        })
        .path('/self/minuteBanks')
        .build();
      const getMinuteBankRes = await getMinuteBankController.makeRequest(getMinuteBankHttpRequest);
      expect(getMinuteBankRes.statusCode).to.equal(200);
      expect(getMinuteBankRes.body).to.have.property('minuteBanks');
      if ('minuteBanks' in getMinuteBankRes.body) {
        expect(getMinuteBankRes.body.minuteBanks[0]._id).to.deep.equal(fakeMinuteBank._id);
      }
    });

    it('should get the minute bank (related party -- reservedById)', async () => {
      const getMinuteBankHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeTeacher._id,
          role: fakeTeacher.role,
        })
        .path('/self/minuteBanks')
        .build();
      const getMinuteBankRes = await getMinuteBankController.makeRequest(getMinuteBankHttpRequest);
      expect(getMinuteBankRes.statusCode).to.equal(200);
      expect(getMinuteBankRes.body).to.have.property('minuteBanks');
      if ('minuteBanks' in getMinuteBankRes.body) {
        expect(getMinuteBankRes.body.minuteBanks[0]._id).to.deep.equal(fakeMinuteBank._id);
      }
    });
  });
});
