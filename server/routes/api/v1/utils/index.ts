import express from 'express';
import { makeGetExchangeRatesController } from '../../../../components/controllers/exchangeRate/getExchangeRatesController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const utils = express.Router();

utils.get('/exchangeRates', makeJSONExpressCallback.consume(makeGetExchangeRatesController));

export { utils };
