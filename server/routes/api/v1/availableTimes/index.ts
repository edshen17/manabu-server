import express from 'express';
import { makeCreateAvailableTimeController } from '../../../../components/controllers/availableTime/createAvailableTimeController';

import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
const availableTime = express.Router();

availableTime.post('/create', makeJSONExpressCallback.consume(makeCreateAvailableTimeController));

export { availableTime };
