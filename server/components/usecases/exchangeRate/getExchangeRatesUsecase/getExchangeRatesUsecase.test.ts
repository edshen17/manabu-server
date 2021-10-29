import { expect } from 'chai';
import { makeGetExchangeRatesUsecase } from '.';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetExchangeRatesUsecase } from './getExchangeRatesUsecase';

let getExchangeRatesUsecase: GetExchangeRatesUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  getExchangeRatesUsecase = await makeGetExchangeRatesUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
});

beforeEach(async () => {
  routeData = {
    headers: {},
    params: {},
    body: {},
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    userId: undefined,
    role: 'user',
  };
});

describe('getExchangeRatesUsecase', () => {
  describe('makeRequest', () => {
    const getExchangeRates = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getExchangeRateRes = await getExchangeRatesUsecase.makeRequest(controllerData);
      const exchangeRates = getExchangeRateRes.exchangeRates;
      return exchangeRates;
    };
    it('should get the latest or cached exchange rate', async () => {
      const exchangeRates = await getExchangeRates();
      expect(exchangeRates).to.have.property('SGD');
    });
  });
});
