import axios from 'axios';
import money from 'money';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { ExchangeRateHandler } from './exchangeRateHandler';
const currency = require('currency.js');

const makeExchangeRateHandler = new ExchangeRateHandler().init({
  axios,
  makeCacheDbService,
  money,
  currency,
});

export { makeExchangeRateHandler };
