import express from 'express';
import { makeCreateAvailableTimeController } from '../../../../components/controllers/availableTime/createAvailableTimeController';
import { makeDeleteAvailableTimeController } from '../../../../components/controllers/availableTime/deleteAvailableTimeController';
import { makeEditAvailableTimeController } from '../../../../components/controllers/availableTime/editAvailableTimeController';
import { makeGetAvailableTimesController } from '../../../../components/controllers/availableTime/getAvailableTimesController';

import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
const availableTime = express.Router();

availableTime.get('/self', makeJSONExpressCallback.consume(makeGetAvailableTimesController));

availableTime.put(
  '/:availableTimeId',
  makeJSONExpressCallback.consume(makeEditAvailableTimeController)
);

availableTime.delete(
  '/:availableTimeId',
  makeJSONExpressCallback.consume(makeDeleteAvailableTimeController)
);

availableTime.post('/create', makeJSONExpressCallback.consume(makeCreateAvailableTimeController));

export { availableTime };
