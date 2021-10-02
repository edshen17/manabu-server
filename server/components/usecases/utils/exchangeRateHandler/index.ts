import axios from 'axios';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { ExchangeRateHandler } from './exchangeRateHandler';

const makeExchangeRateHandler = new ExchangeRateHandler().init({ axios, makeCacheDbService });

export { makeExchangeRateHandler };
