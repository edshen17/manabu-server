import express from 'express';
import { makeCreateAppointmentsController } from '../../../../components/controllers/appointment/createAppointmentsController';
import { makeEditAppointmentController } from '../../../../components/controllers/appointment/editAppointmentController';
import { makeGetAppointmentController } from '../../../../components/controllers/appointment/getAppointmentController';
import { makeGetAppointmentsController } from '../../../../components/controllers/appointment/getAppointmentsController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const appointments = express.Router();

appointments.get('/self', makeJSONExpressCallback.consume(makeGetAppointmentsController));
appointments.get('/:appointmentId', makeJSONExpressCallback.consume(makeGetAppointmentController));
appointments.post('/create', makeJSONExpressCallback.consume(makeCreateAppointmentsController));
appointments.put('/:appointmentId', makeJSONExpressCallback.consume(makeEditAppointmentController));

export { appointments };
