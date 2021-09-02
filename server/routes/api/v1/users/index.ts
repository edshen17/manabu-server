import express from 'express';
import { makeGetAvailableTimesController } from '../../../../components/controllers/availableTime/getAvailableTimesController';
import { makeCreateUserController } from '../../../../components/controllers/user/createUserController';
import { makeEditUserController } from '../../../../components/controllers/user/editUserController';
import { makeGetUserController } from '../../../../components/controllers/user/getUserController';
import {
  makeJSONCookieExpressCallback,
  makeJSONExpressCallback,
} from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
import { auth } from './auth/index';
const users = express.Router();

users.get('/:userId', makeJSONExpressCallback.consume(makeGetUserController));
users.patch('/:userId', makeJSONExpressCallback.consume(makeEditUserController));
users.get(
  '/:userId/availableTimes',
  makeJSONExpressCallback.consume(makeGetAvailableTimesController)
);
users.post('/create', makeJSONCookieExpressCallback.consume(makeCreateUserController));
users.use('/auth', auth);

export { users };
