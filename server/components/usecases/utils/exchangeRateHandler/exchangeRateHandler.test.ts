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
        amount: 10,
        fromCurrency: 'usd',
        toCurrency: 'jpy',
      });
      expect(convertedRate > 10).to.equal(true);
    });
  });
});
