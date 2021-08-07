import express from 'express';
import { auth } from './auth/index';
import { makeCreateUserController } from '../../../../components/controllers/user/createUserController';
import { makeEditUserController } from '../../../../components/controllers/user/editUserController';
import { makeGetUserController } from '../../../../components/controllers/user/getUserController';
import {
  makeJSONCookieExpressCallback,
  makeJSONExpressCallback,
} from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
import { makeGetAvailableTimesController } from '../../../../components/controllers/availableTime/getAvailableTimesController';
const users = express.Router();

users.get('/:userId', makeJSONExpressCallback.consume(makeGetUserController));
users.patch('/:userId', makeJSONExpressCallback.consume(makeEditUserController));
users.get(
  '/:userId/availableTimes',
  makeJSONExpressCallback.consume(makeGetAvailableTimesController)
);

users.get('/self', makeJSONExpressCallback.consume(makeGetUserController));
users.post('/create', makeJSONCookieExpressCallback.consume(makeCreateUserController));

users.use('/auth', auth);

export { users };
