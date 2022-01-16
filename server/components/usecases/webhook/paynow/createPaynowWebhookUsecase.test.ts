import { expect } from 'chai';
import { makeCreatePaynowWebhookUsecase } from '.';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { makeFakePackageTransactionCheckoutTokenHandler } from '../../utils/fakePackageTransactionCheckoutTokenHandler';
import { FakePackageTransactionCheckoutTokenHandler } from '../../utils/fakePackageTransactionCheckoutTokenHandler/fakePackageTransactionCheckoutTokenHandler';
import {
  CreatePaynowWebhookUsecase,
  CreatePaynowWebhookUsecaseResponse,
} from './createPaynowWebhookUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let createPaynowWebhookUsecase: CreatePaynowWebhookUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakePackageTransactionCheckoutTokenHandler: FakePackageTransactionCheckoutTokenHandler;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createPaynowWebhookUsecase = await makeCreatePaynowWebhookUsecase;
  fakePackageTransactionCheckoutTokenHandler = await makeFakePackageTransactionCheckoutTokenHandler;
});

beforeEach(async () => {
  const tokenData = await fakePackageTransactionCheckoutTokenHandler.createTokenData();
  const { token } = tokenData;
  currentAPIUser = tokenData.currentAPIUser;
  routeData = {
    rawBody: {},
    params: {},
    body: {
      key: 'charge.complete',
      data: {
        id: 'chrg_test_5pquctyn90hobjzd4fd',
        metadata: {
          token,
        },
      },
    },
    query: {},
    endpointPath: '',
    headers: {},
  };
});

describe('createPaynowWebhookUsecase', () => {
  describe('makeRequest', () => {
    const createPaynowWebhook = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createPaynowWebhookRes = await createPaynowWebhookUsecase.makeRequest(controllerData);
      return createPaynowWebhookRes;
    };
    const testPaynowWebhookError = async () => {
      let error;
      try {
        error = await createPaynowWebhook();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };
    context('packageTransaction', () => {
      context('successful payment', () => {
        const validResOutput = (createPaynowWebhookRes: CreatePaynowWebhookUsecaseResponse) => {
          const packageTransaction = createPaynowWebhookRes.packageTransaction;
          expect(packageTransaction).to.have.property('_id');
          expect(packageTransaction).to.have.property('hostedById');
          expect(packageTransaction).to.have.property('reservedById');
        };
        it('should return a new packageTransaction', async () => {
          const createStripeWebhookRes = await createPaynowWebhook();
          validResOutput(createStripeWebhookRes);
        });
      });
      context('invalid payment', () => {
        it('should throw an error', async () => {
          routeData.body.data.metadata.token = 'bad token';
          await testPaynowWebhookError();
        });
      });
    });
  });
});
