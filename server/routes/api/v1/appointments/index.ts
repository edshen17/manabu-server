import express from 'express';
import { makeCreateAppointmentsController } from '../../../../components/controllers/appointment/createAppointmentsController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const appointments = express.Router();

// create /self route?
appointments.post('/create', makeJSONExpressCallback.consume(makeCreateAppointmentsController));

export { appointments };
