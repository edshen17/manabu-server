import { expect } from 'chai';
import { makeCreatePackageTransactionCheckoutController } from '.';
import { JoinedUserDoc } from '../../../../../models/User';
import { StringKeyObject } from '../../../../../types/custom';
import { makeFakeDbUserFactory } from '../../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeQueryStringHandler } from '../../../../usecases/utils/queryStringHandler';
import { QueryStringHandler } from '../../../../usecases/utils/queryStringHandler/queryStringHandler';
import { CurrentAPIUser } from '../../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { makeIHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { CreatePackageTransactionCheckoutController } from './createPackageTransactionCheckoutController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;
let body: StringKeyObject;
let queryStringHandler: QueryStringHandler;
let queryToEncode: StringKeyObject;
let query: StringKeyObject;
let createPackageTransactionCheckoutController: CreatePackageTransactionCheckoutController;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  queryStringHandler = makeQueryStringHandler;
  createPackageTransactionCheckoutController = await makeCreatePackageTransactionCheckoutController;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithPackages();
  body = {
    teacherId: fakeTeacher.teacherData!._id,
    packageId: fakeTeacher.teacherData!.packages[0]._id,
    lessonDuration: 60,
    lessonLanguage: 'ja',
    lessonAmount: 5,
  };
  queryToEncode = {
    paymentGateway: 'paypal',
  };
  currentAPIUser = {
    userId: fakeUser._id,
    role: fakeUser.role,
  };
});

describe('createAppointmentsController', () => {
  describe('makeRequest', () => {
    const createPackageTransactionCheckout = async () => {
      const encodedQuery = queryStringHandler.encodeQueryStringObj(queryToEncode);
      query = queryStringHandler.parseQueryString(encodedQuery);
      const createPackageTransactionCheckoutHttpRequest = iHttpRequestBuilder
        .body(body)
        .currentAPIUser(currentAPIUser)
        .query(query)
        .build();
      const createPackageTransactionCheckoutRes =
        await createPackageTransactionCheckoutController.makeRequest(
          createPackageTransactionCheckoutHttpRequest
        );
      return createPackageTransactionCheckoutRes;
    };
    const testValidPackageTransactionCheckout = async () => {
      const createPackageTransactionCheckoutRes = await createPackageTransactionCheckout();
      expect(createPackageTransactionCheckoutRes.statusCode).to.equal(200);
      expect(createPackageTransactionCheckoutRes.body).to.have.property('redirectUrl');
    };
    const testInvalidPackageTransactionCheckout = async () => {
      const createPackageTransactionCheckoutRes = await createPackageTransactionCheckout();
      expect(createPackageTransactionCheckoutRes.statusCode).to.equal(500);
    };
    context('valid inputs', () => {
      context('paypal', () => {
        it('should create a checkout', async () => {
          await testValidPackageTransactionCheckout();
        });
      });
      context('stripe', () => {
        it('should create a checkout', async () => {
          queryToEncode.paymentGateway = 'stripe';
          await testValidPackageTransactionCheckout();
        });
      });
      context('paynow', () => {
        it('should create a checkout', async () => {
          queryToEncode.paymentGateway = 'paynow';
          await testValidPackageTransactionCheckout();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if gateway is invalid', async () => {
        queryToEncode.paymentGateway = 'some unsupported gateway';
        await testInvalidPackageTransactionCheckout();
      });
      it('should throw an error if body is invalid', async () => {
        body.lessonAmount = 99;
        await testInvalidPackageTransactionCheckout();
      });
      it('should throw an error if the user is not logged in', async () => {
        currentAPIUser.userId = undefined;
        await testInvalidPackageTransactionCheckout();
      });
    });
  });
});
