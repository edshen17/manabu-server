"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let exchangeRateHandler;
before(async () => {
    exchangeRateHandler = await _1.makeExchangeRateHandler;
});
describe('exchangeRateHandler', () => {
    describe('getRates', () => {
        it('should get the latest or cached exchange rate', async () => {
            const exchangeRates = await exchangeRateHandler.getRates();
            (0, chai_1.expect)(exchangeRates).to.have.property('SGD');
        });
    });
    describe('convert', () => {
        it('should convert the currencies', async () => {
            const convertedRate = await exchangeRateHandler.convert({
                amount: 1000,
                sourceCurrency: 'jpy',
                targetCurrency: 'usd',
            });
            (0, chai_1.expect)(convertedRate < 1000).to.equal(true);
        });
    });
    describe('add', () => {
        it('should add the currencies', async () => {
            const currencySum = await exchangeRateHandler.add({
                addend1: {
                    amount: 10000,
                    sourceCurrency: 'JPY',
                },
                addend2: {
                    amount: 1000,
                    sourceCurrency: 'SGD',
                },
                targetCurrency: 'SGD',
            });
            (0, chai_1.expect)(currencySum < 10000).to.equal(true);
        });
    });
    describe('subtract', () => {
        it('should subtract the currencies', async () => {
            const currencyDiff = await exchangeRateHandler.subtract({
                minuend: {
                    amount: 1000,
                    sourceCurrency: 'SGD',
                },
                subtrahend: {
                    amount: 1000,
                    sourceCurrency: 'JPY',
                },
                targetCurrency: 'SGD',
            });
            (0, chai_1.expect)(currencyDiff < 2000).to.equal(true);
        });
    });
    describe('multiply', () => {
        it('should multiply the currencies', async () => {
            const currencyProduct = await exchangeRateHandler.multiply({
                multiplicand: {
                    amount: 1000,
                    sourceCurrency: 'JPY',
                },
                multiplier: {
                    amount: 1000,
                    sourceCurrency: 'SGD',
                },
                targetCurrency: 'SGD',
            });
            (0, chai_1.expect)(currencyProduct > 10000).to.equal(true);
        });
        it('should multiply the currencies', async () => {
            const currencyProduct = await exchangeRateHandler.multiply({
                multiplicand: { sourceCurrency: 'USD', amount: 30 },
                multiplier: { amount: 5 },
                targetCurrency: 'SGD',
            });
            (0, chai_1.expect)(currencyProduct > 150).to.equal(true);
        });
    });
    describe('toCurrency', () => {
        it('should turn the given number into a currency', () => {
            const convertedCurrency = exchangeRateHandler.toCurrency(11.111);
            (0, chai_1.expect)(convertedCurrency).to.equal(11.11);
        });
    });
});
