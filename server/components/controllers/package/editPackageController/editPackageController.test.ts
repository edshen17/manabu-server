import { expect } from 'chai';
import { makeEditPackageController } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { DeletePackageUsecaseResponse } from '../../../usecases/package/deletePackageUsecase/deletePackageUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { EditPackageController } from './editPackageController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let editPackageController: EditPackageController;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let fakeUser: JoinedUserDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  editPackageController = await makeEditPackageController;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithPackages();
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  params = {
    packageId: fakeTeacher.teacherData!.packages[0]._id,
  };
  body = {
    lessonDurations: [90],
  };
  currentAPIUser = {
    role: fakeTeacher.role,
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
  };
});

describe('editPackageController', () => {
  describe('makeRequest', () => {
    const editPackage = async (): Promise<ControllerResponse<DeletePackageUsecaseResponse>> => {
      const editPackageHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const editPackageRes = await editPackageController.makeRequest(editPackageHttpRequest);
      return editPackageRes;
    };
    context('valid inputs', () => {
      it('should edit the package', async () => {
        const editPackageRes = await editPackage();
        expect(editPackageRes.statusCode).to.equal(200);
        if ('package' in editPackageRes.body) {
          expect(editPackageRes.body.package.lessonDurations).to.deep.equal([90]);
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        body = {
          lessonDurations: [4312],
        };
        const editPackageRes = await editPackage();
        expect(editPackageRes.statusCode).to.equal(401);
      });
      it('should throw an error if user does not have access to the resource', async () => {
        currentAPIUser.userId = fakeUser._id;
        const editPackageRes = await editPackage();
        expect(editPackageRes.statusCode).to.equal(401);
      });
      it('should throw an error if the user is not logged in', async () => {
        currentAPIUser.userId = undefined;
        const editPackageRes = await editPackage();
        expect(editPackageRes.statusCode).to.equal(401);
      });
    });
  });
});
