import { expect } from 'chai';
import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { JoinedUserDoc } from '../../../dataAccess/services/user/userDbService';
import { makeFakeDbMinuteBankFactory } from '../../../dataAccess/testFixtures/fakeDbMinuteBankFactory';
import { FakeDbMinuteBankFactory } from '../../../dataAccess/testFixtures/fakeDbMinuteBankFactory/fakeDbMinuteBankFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { IHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder/IHttpRequestBuilder';
import { makeGetMinuteBankController } from '.';
import { GetMinuteBankController } from './getMinuteBankController';
import { makeIHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder';

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
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  fakeMinuteBank = await fakeDbMinuteBankFactory.createFakeDbData({
    hostedBy: fakeTeacher._id,
    reservedBy: fakeUser._id,
  });
  iHttpRequestBuilder = makeIHttpRequestBuilder;
});

describe('getMinuteBankController', () => {
  describe('makeRequest', () => {
    it('should get the minute bank (related party -- hostedBy)', async () => {
      const getMinuteBankHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeUser._id,
          role: fakeUser.role,
        })
        .path('/self/minuteBanks')
        .build();
      const getMinuteBankRes = await getMinuteBankController.makeRequest(getMinuteBankHttpRequest);
      if ('minuteBanks' in getMinuteBankRes.body) {
        expect(getMinuteBankRes.body.minuteBanks[0]._id.toString()).to.deep.equal(
          fakeMinuteBank._id.toString()
        );
      }
    });

    it('should get the minute bank (related party -- reservedBy)', async () => {
      const getMinuteBankHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeTeacher._id,
          role: fakeTeacher.role,
        })
        .path('/self/minuteBanks')
        .build();
      const getMinuteBankRes = await getMinuteBankController.makeRequest(getMinuteBankHttpRequest);
      if ('minuteBanks' in getMinuteBankRes.body) {
        expect(getMinuteBankRes.body.minuteBanks[0]._id.toString()).to.deep.equal(
          fakeMinuteBank._id.toString()
        );
      }
    });
  });
});
