import { expect } from 'chai';
import { makeGetExchangeRatesController } from '.';
import { StringKeyObject } from '../../../../types/custom';
import { GetExchangeRatesUsecaseResponse } from '../../../usecases/exchangeRate/getExchangeRatesUsecase/getExchangeRatesUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetExchangeRatesController } from './getExchangeRatesController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let getExchangeRatesController: GetExchangeRatesController;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getExchangeRatesController = await makeGetExchangeRatesController;
});

beforeEach(async () => {
  params = {};
  body = {};
  currentAPIUser = {
    role: 'user',
    userId: undefined,
  };
});

describe('getExchangeRatesController', () => {
  describe('makeRequest', () => {
    const getExchangeRates = async (): Promise<
      ControllerResponse<GetExchangeRatesUsecaseResponse>
    > => {
      const getAvailableTimesHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const getExchangeRatesRes = await getExchangeRatesController.makeRequest(
        getAvailableTimesHttpRequest
      );
      return getExchangeRatesRes;
    };
    it('should get the latest or cached exchange rate', async () => {
      const getExchangeRatesRes = await getExchangeRates();
      expect(getExchangeRatesRes.statusCode).to.equal(200);
      expect(getExchangeRatesRes.body).to.have.property('exchangeRates');
    });
  });
});
