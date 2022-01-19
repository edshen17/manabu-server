import express from 'express';
import { makeGetExchangeRatesController } from '../../../../components/controllers/exchangeRate/getExchangeRatesController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const exchangeRates = express.Router();

exchangeRates.get('/', makeJSONExpressCallback.consume(makeGetExchangeRatesController));

export { exchangeRates };
