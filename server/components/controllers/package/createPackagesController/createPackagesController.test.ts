import { expect } from 'chai';
import { makeCreatePackagesController } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { PACKAGE_ENTITY_TYPE } from '../../../entities/package/packageEntity';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { CreatePackagesController } from './createPackagesController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;
let body: { packages: any[] };
let createPackagesController: CreatePackagesController;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  createPackagesController = await makeCreatePackagesController;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  body = {
    packages: [
      {
        lessonAmount: 11,
        isOffering: true,
        type: PACKAGE_ENTITY_TYPE.CUSTOM,
        name: 'custom package name',
        lessonDurations: [30],
      },
    ],
  };
  currentAPIUser = {
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
    role: fakeTeacher.role,
  };
});

describe('createPackagesController', () => {
  describe('makeRequest', () => {
    const createPackages = async () => {
      const createPackagesHttpRequest = iHttpRequestBuilder
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const createPackages = await createPackagesController.makeRequest(createPackagesHttpRequest);
      return createPackages;
    };
    context('valid inputs', () => {
      it('should create a new package', async () => {
        const createAppointmentsRes = await createPackages();
        expect(createAppointmentsRes.statusCode).to.equal(201);
        if ('packages' in createAppointmentsRes.body) {
          expect(createAppointmentsRes.body.packages[0].lessonAmount).to.equal(
            body.packages[0].lessonAmount
          );
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        body.packages[0].hostedById = 'some id';
        const createAppointmentsRes = await createPackages();
        expect(createAppointmentsRes.statusCode).to.equal(409);
      });
      it('should throw an error if the user is not a teacher', async () => {
        currentAPIUser.userId = fakeUser._id;
        currentAPIUser.teacherId = undefined;
        const createAppointmentsRes = await createPackages();
        expect(createAppointmentsRes.statusCode).to.equal(409);
      });
    });
  });
});
