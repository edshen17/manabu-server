import { expect } from 'chai';
import { makeExchangeRateHandler } from '.';
import { ExchangeRateHandler } from './exchangeRateHandler';

let exchangeRateHandler: ExchangeRateHandler;

before(async () => {
  exchangeRateHandler = await makeExchangeRateHandler;
});

describe('exchangeRateHandler', () => {
  describe('getRates', () => {
    it('should get the latest or cached exchange rate', async () => {
      const exchangeRates = await exchangeRateHandler.getRates();
      expect(exchangeRates).to.have.property('SGD');
    });
  });
  describe('convert', () => {
    it('should convert the currencies', async () => {
      const convertedRate = await exchangeRateHandler.convert({
        amount: 1000,
        sourceCurrency: 'jpy',
        targetCurrency: 'usd',
      });
      expect(convertedRate < 1000).to.equal(true);
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
      expect(currencySum < 10000).to.equal(true);
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
      expect(currencyDiff < 2000).to.equal(true);
    });
  });
  describe('multiply', () => {
    it('should multiply the currencies', async () => {
      const currencyProduct = await exchangeRateHandler.multiply({
        multiplicand: {
          amount: 1000,
          sourceCurrency: 'SGD',
        },
        multiplier: {
          amount: 1000,
          sourceCurrency: 'SGD',
        },
        targetCurrency: 'SGD',
      });
      expect(currencyProduct).to.equal(1000000);
    });
    it('should multiply the currencies', async () => {
      const currencyProduct = await exchangeRateHandler.multiply({
        multiplicand: { sourceCurrency: 'USD', amount: 30 },
        multiplier: { amount: 5 },
        targetCurrency: 'SGD',
      });
      expect(currencyProduct > 150).to.equal(true);
    });
  });
  describe('toCurrency', () => {
    it('should turn the given number into a currency', () => {
      const convertedCurrency = exchangeRateHandler.toCurrency(11.111);
      expect(convertedCurrency).to.equal(11.11);
    });
  });
});
