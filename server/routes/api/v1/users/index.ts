import express from 'express';
import { auth } from './auth/index';
import { makeCreateUserController } from '../../../../components/controllers/user/createUserController';
import { makeEditUserController } from '../../../../components/controllers/user/editUserController';
import { makeGetUserController } from '../../../../components/controllers/user/getUserController';
import {
  makeJSONCookieExpressCallback,
  makeJSONExpressCallback,
} from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
const users = express.Router();
const VerifyToken = require('../../../../components/VerifyToken');

users.get('/:userId', VerifyToken, makeJSONExpressCallback.consume(makeGetUserController));
users.put('/:userId', VerifyToken, makeJSONExpressCallback.consume(makeEditUserController));

users.get('/self', VerifyToken, makeJSONExpressCallback.consume(makeGetUserController));
users.post('/create', makeJSONCookieExpressCallback.consume(makeCreateUserController));

users.use('/auth/', auth);

export { users };
