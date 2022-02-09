"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const iHttpRequestBuilder_1 = require("../../utils/iHttpRequestBuilder");
let iHttpRequestBuilder;
let getExchangeRatesController;
let body;
let currentAPIUser;
let params;
before(async () => {
    iHttpRequestBuilder = iHttpRequestBuilder_1.makeIHttpRequestBuilder;
    getExchangeRatesController = await _1.makeGetExchangeRatesController;
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
        const getExchangeRates = async () => {
            const getAvailableTimesHttpRequest = iHttpRequestBuilder
                .params(params)
                .body(body)
                .currentAPIUser(currentAPIUser)
                .build();
            const getExchangeRatesRes = await getExchangeRatesController.makeRequest(getAvailableTimesHttpRequest);
            return getExchangeRatesRes;
        };
        it('should get the latest or cached exchange rate', async () => {
            const getExchangeRatesRes = await getExchangeRates();
            (0, chai_1.expect)(getExchangeRatesRes.statusCode).to.equal(200);
            (0, chai_1.expect)(getExchangeRatesRes.body).to.have.property('exchangeRates');
        });
    });
});
