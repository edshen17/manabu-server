import { expect } from 'chai';
import { makeDeletePackageController } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { DeletePackageUsecaseResponse } from '../../../usecases/package/deletePackageUsecase/deletePackageUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { DeletePackageController } from './deletePackageController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let deletePackageController: DeletePackageController;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let fakeUser: JoinedUserDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  deletePackageController = await makeDeletePackageController;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  params = {
    packageId: fakeTeacher.teacherData!.packages[3]._id,
  };
  body = {};
  currentAPIUser = {
    role: fakeTeacher.role,
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
  };
});

describe('deletePackageController', () => {
  describe('makeRequest', () => {
    const deletePackage = async (): Promise<ControllerResponse<DeletePackageUsecaseResponse>> => {
      const deletePackageHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const deletePackageRes = await deletePackageController.makeRequest(deletePackageHttpRequest);
      return deletePackageRes;
    };
    context('valid inputs', () => {
      it('should delete the package', async () => {
        const deletePackageRes = await deletePackage();
        expect(deletePackageRes.statusCode).to.equal(200);
      });
      it('should throw error if deleting default package', async () => {
        params.packageId = fakeTeacher.teacherData!.packages[0]._id;
        const deletePackageRes = await deletePackage();
        expect(deletePackageRes.statusCode).to.equal(500);
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {};
        const deletePackageRes = await deletePackage();
        expect(deletePackageRes.statusCode).to.equal(500);
      });
      it('should throw an error if user does not have access to the resource', async () => {
        currentAPIUser.userId = fakeUser._id;
        const deletePackageRes = await deletePackage();
        expect(deletePackageRes.statusCode).to.equal(500);
      });
      it('should throw an error if the user is not logged in', async () => {
        currentAPIUser.userId = undefined;
        const deletePackageRes = await deletePackage();
        expect(deletePackageRes.statusCode).to.equal(500);
      });
    });
  });
});
