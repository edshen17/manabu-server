import express from 'express';
import { makeGetAppointmentsController } from '../../../../../components/controllers/appointment/getAppointmentsController';
import { makeGetAvailableTimesController } from '../../../../../components/controllers/availableTime/getAvailableTimesController';
import { makeGetContentsController } from '../../../../../components/controllers/content/getContentsController';
import { makeGetPackageTransactionsController } from '../../../../../components/controllers/packageTransaction/getPackageTransactionsController';
import { makeGetUserTeacherEdgesController } from '../../../../../components/controllers/user/getUserTeacherEdgesController';
import { makeJSONExpressCallback } from '../../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const self = express.Router();

self.get('/userTeacherEdges', makeJSONExpressCallback.consume(makeGetUserTeacherEdgesController));
self.get('/appointments', makeJSONExpressCallback.consume(makeGetAppointmentsController));
self.get('/availableTimes', makeJSONExpressCallback.consume(makeGetAvailableTimesController));
self.get(
  '/packageTransactions',
  makeJSONExpressCallback.consume(makeGetPackageTransactionsController)
);
self.get('/contents', makeJSONExpressCallback.consume(makeGetContentsController));

export { self };
