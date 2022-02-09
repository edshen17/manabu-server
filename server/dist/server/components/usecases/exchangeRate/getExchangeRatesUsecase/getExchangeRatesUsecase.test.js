"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let getExchangeRatesUsecase;
let controllerDataBuilder;
let routeData;
let currentAPIUser;
before(async () => {
    getExchangeRatesUsecase = await _1.makeGetExchangeRatesUsecase;
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
});
beforeEach(async () => {
    routeData = {
        rawBody: {},
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
            (0, chai_1.expect)(exchangeRates).to.have.property('SGD');
        });
    });
});
