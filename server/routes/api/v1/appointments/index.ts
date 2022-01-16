import express from 'express';
import { makeCreateAppointmentsController } from '../../../../components/controllers/appointment/createAppointmentsController';
import { makeEditAppointmentController } from '../../../../components/controllers/appointment/editAppointmentController';
import { makeGetAppointmentController } from '../../../../components/controllers/appointment/getAppointmentController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const appointments = express.Router();

appointments.get('/:appointmentId', makeJSONExpressCallback.consume(makeGetAppointmentController));
appointments.post('/', makeJSONExpressCallback.consume(makeCreateAppointmentsController));
appointments.patch(
  '/:appointmentId',
  makeJSONExpressCallback.consume(makeEditAppointmentController)
);

export { appointments };
