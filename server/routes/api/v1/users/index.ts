import express from 'express';
import { makeGetAppointmentsController } from '../../../../components/controllers/appointment/getAppointmentsController';
import { makeGetAvailableTimesController } from '../../../../components/controllers/availableTime/getAvailableTimesController';
import { makeCreateUserController } from '../../../../components/controllers/user/createUserController';
import { makeEditUserController } from '../../../../components/controllers/user/editUserController';
import { makeGetUserController } from '../../../../components/controllers/user/getUserController';
import { makeGetUserTeacherEdgesController } from '../../../../components/controllers/user/getUserTeacherEdgesController';
import {
  makeJSONCookieExpressCallback,
  makeJSONExpressCallback,
} from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
import { auth } from './auth/index';
import { self } from './self';

const users = express.Router();

users.get('/:userId', makeJSONCookieExpressCallback.consume(makeGetUserController));
users.get(
  '/:userId/availableTimes',
  makeJSONExpressCallback.consume(makeGetAvailableTimesController)
);
users.get('/:userId/appointments', makeJSONExpressCallback.consume(makeGetAppointmentsController));
users.get(
  '/:userId/userTeacherEdges',
  makeJSONExpressCallback.consume(makeGetUserTeacherEdgesController)
);
users.patch('/:userId', makeJSONExpressCallback.consume(makeEditUserController));
users.post('/', makeJSONCookieExpressCallback.consume(makeCreateUserController));
users.use('/auth', auth);
users.use('/self', self);

export { users };
