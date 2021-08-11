import express from 'express';
import { makeCreateAppointmentsController } from '../../../../components/controllers/appointment/createAppointmentsController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const appointments = express.Router();

// /self
appointments.post('/create', makeJSONExpressCallback.consume(makeCreateAppointmentsController));

export { appointments };
