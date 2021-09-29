import { expect } from 'chai';
import { makeEditPackageUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { EditPackageUsecase } from './editPackageUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let editPackageUsecase: EditPackageUsecase;
let routeData: RouteData;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  editPackageUsecase = await makeEditPackageUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithPackages();
  currentAPIUser = {
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
    role: fakeTeacher.role,
  };
  routeData = {
    params: {
      packageId: fakeTeacher.teacherData!.packages[3]._id,
    },
    body: {
      lessonAmount: 10,
    },
    query: {},
    endpointPath: '',
  };
});

describe('editPackageUsecase', () => {
  describe('makeRequest', () => {
    const editPackage = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const editPackagesRes = await editPackageUsecase.makeRequest(controllerData);
      const editedPackage = editPackagesRes.package;
      return editedPackage;
    };

    const testPackageError = async () => {
      try {
        await editPackage();
      } catch (err) {
        expect(err).to.be.an('error');
      }
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
          currentAPIUser.teacherId = undefined;
          await testPackageError();
        });
        it('should throw an error if editing restricted fields on default package', async () => {
          routeData.params.packageId = fakeTeacher.teacherData!.packages[0]._id;
          await testPackageError();
        });
      });
      context('valid inputs', () => {
        it('should edit the package', async () => {
          const updatedPackage = await editPackage();
          expect(updatedPackage.lessonAmount).to.equal(10);
        });
      });
    });
  });
});
