import { expect } from 'chai';
import { makeCreatePackagesUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { PACKAGE_ENTITY_TYPE } from '../../../entities/package/packageEntity';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { CreatePackagesUsecase } from './createPackagesUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let createPackagesUsecase: CreatePackagesUsecase;
let routeData: RouteData;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createPackagesUsecase = await makeCreatePackagesUsecase;
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
    params: {},
    body: {
      packages: [
        {
          lessonAmount: 6,
          packageType: PACKAGE_ENTITY_TYPE.CUSTOM,
          packageName: 'some package name',
          isOffering: true,
          lessonDurations: [30, 60],
        },
      ],
    },
    query: {},
    endpointPath: '',
  };
});

describe('createPackageUsecase', () => {
  describe('makeRequest', () => {
    const createPackages = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const createPackagesRes = await createPackagesUsecase.makeRequest(controllerData);
      const packages = createPackagesRes.packages;
      return packages;
    };

    const testPackagesError = async () => {
      let err;
      try {
        err = await createPackages();
      } catch (err) {
        return;
      }
      console.log(err, 'here1');
      expect(err).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if restricted fields found in body', async () => {
          routeData.body = {};
          await testPackagesError();
        });
        it('should throw an error if user does not have access', async () => {
          currentAPIUser.teacherId = undefined;
          await testPackagesError();
        });
      });
      context('valid inputs', () => {
        it('should create new packages', async () => {
          const packages = await createPackages();
          expect(packages[0].lessonAmount).to.equal(routeData.body.packages[0].lessonAmount);
        });
      });
    });
  });
});
