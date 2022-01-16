import { expect } from 'chai';
import { makeDeletePackageUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { DeletePackageUsecase } from './deletePackageUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let deletePackageUsecase: DeletePackageUsecase;
let routeData: RouteData;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  deletePackageUsecase = await makeDeletePackageUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  currentAPIUser = {
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
    role: fakeTeacher.role,
  };
  routeData = {
    rawBody: {},
    headers: {},
    params: {
      packageId: fakeTeacher.teacherData!.packages[3]._id,
    },
    body: {},
    query: {},
    endpointPath: '',
  };
});

describe('deletePackageUsecase', () => {
  describe('makeRequest', () => {
    const deletePackage = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const deletePackagesRes = await deletePackageUsecase.makeRequest(controllerData);
      const deletedPackage = deletePackagesRes.package;
      return deletedPackage;
    };

    const testPackageError = async () => {
      let error;
      try {
        await deletePackage();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if restricted fields found in body', async () => {
          const routeDataBody = routeData.body;
          routeDataBody.hostedById = 'some id';
          routeDataBody.createdDate = new Date();
          await testPackageError();
        });
        it('should throw an error if user does not have access', async () => {
          currentAPIUser.userId = undefined;
          currentAPIUser.teacherId = undefined;
          await testPackageError();
        });
      });
      context('valid inputs', () => {
        it('should delete the package', async () => {
          const updatedPackages = await deletePackage();
          expect(updatedPackages).to.not.equal(undefined);
        });
        it('should not delete the package if it is a default package', async () => {
          routeData.params.packageId = fakeTeacher.teacherData!.packages[0]._id;
          await testPackageError();
        });
      });
    });
  });
});
