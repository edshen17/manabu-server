import express from 'express';
import { makeCreateAvailableTimeController } from '../../../../components/controllers/availableTime/createAvailableTimeController';
import { makeDeleteAvailableTimeController } from '../../../../components/controllers/availableTime/deleteAvailableTimeController';
import { makeEditAvailableTimeController } from '../../../../components/controllers/availableTime/editAvailableTimeController';
import { makeGetAvailableTimesController } from '../../../../components/controllers/availableTime/getAvailableTimesController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const availableTimes = express.Router();

availableTimes.get('/self', makeJSONExpressCallback.consume(makeGetAvailableTimesController));

availableTimes.patch(
  '/:availableTimeId',
  makeJSONExpressCallback.consume(makeEditAvailableTimeController)
);

availableTimes.delete(
  '/:availableTimeId',
  makeJSONExpressCallback.consume(makeDeleteAvailableTimeController)
);

availableTimes.post('/create', makeJSONExpressCallback.consume(makeCreateAvailableTimeController));

export { availableTimes };
