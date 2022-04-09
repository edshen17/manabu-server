import { expect } from 'chai';
import { makeCreatePaypalWebhookUsecase } from '.';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { makeFakePackageTransactionCheckoutTokenHandler } from '../../utils/fakePackageTransactionCheckoutTokenHandler';
import { FakePackageTransactionCheckoutTokenHandler } from '../../utils/fakePackageTransactionCheckoutTokenHandler/fakePackageTransactionCheckoutTokenHandler';
import {
  CreatePaypalWebhookUsecase,
  CreatePaypalWebhookUsecaseResponse,
} from './createPaypalWebhookUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let createPaypalWebhookUsecase: CreatePaypalWebhookUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakePackageTransactionCheckoutTokenHandler: FakePackageTransactionCheckoutTokenHandler;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createPaypalWebhookUsecase = await makeCreatePaypalWebhookUsecase;
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
      event_type: 'PAYMENTS.PAYMENT.CREATED',
      resource: {
        transactions: [
          {
            custom: token,
          },
        ],
        payer: {
          payment_method: 'paypal',
          status: 'VERIFIED',
          payer_info: {
            email: 'sb-7b43ig5841559@personal.example.com',
            first_name: 'John',
            last_name: 'Doe',
            payer_id: 'V35LZLP6T9FD2',
            shipping_address: {
              recipient_name: 'Doe John',
              line1: '123 Thomson Rd.',
              city: 'Singapore',
              state: 'SG_zip = 308123',
              postal_code: '308123',
              country_code: 'SG',
              default_address: false,
              preferred_address: false,
              primary_address: false,
              disable_for_transaction: false,
            },
            country_code: 'SG',
          },
        },
      },
      id: 'WH-7Y7254563A4550640-11V2185806837105M',
    },
    query: {},
    endpointPath: '',
    headers: {},
    cookies: {},
  };
});

describe('createPaypalWebhookUsecase', () => {
  describe('makeRequest', () => {
    const createPaypalWebhook = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createPaypalWebhookRes = await createPaypalWebhookUsecase.makeRequest(controllerData);
      return createPaypalWebhookRes;
    };
    const testPaypalWebhookError = async () => {
      let error;
      try {
        error = await createPaypalWebhook();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };
    context('packageTransaction', () => {
      context('successful payment', () => {
        const validResOutput = (createPaypalWebhookRes: CreatePaypalWebhookUsecaseResponse) => {
          const packageTransaction = createPaypalWebhookRes.packageTransaction;
          expect(packageTransaction).to.have.property('_id');
          expect(packageTransaction).to.have.property('hostedById');
          expect(packageTransaction).to.have.property('reservedById');
        };
        it('should return a new packageTransaction', async () => {
          const createStripeWebhookRes = await createPaypalWebhook();
          validResOutput(createStripeWebhookRes);
        });
      });
      context('invalid payment', () => {
        it('should throw an error', async () => {
          routeData.body.resource.transactions[0].custom = 'bad token';
          await testPaypalWebhookError();
        });
      });
    });
  });
});
