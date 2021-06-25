import express from 'express';
import { makeGetMinuteBankController } from '../../../components/controllers/minuteBank/getMinuteBankController';
import { makeCreateUserController } from '../../../components/controllers/user/createUserController';
import { makeEditUserController } from '../../../components/controllers/user/editUserController';
import { makeGetUserController } from '../../../components/controllers/user/getUserController';
import { makeLoginUserController } from '../../../components/controllers/user/loginUserController';
import { makeVerifyEmailTokenController } from '../../../components/controllers/user/verifyEmailTokenController';

import {
  makeCookieRedirectExpressCallback,
  makeJSONCookieExpressCallback,
  makeJSONExpressCallback,
  makeRedirectExpressCallback,
} from '../../../components/expressCallback/callbacks/expressCallback';
const users = express.Router();
const VerifyToken = require('../../../components/VerifyToken'); // TODO: turn into ts + import statement

users.get('/self/me', VerifyToken, makeJSONExpressCallback.consume(makeGetUserController));
users.get(
  '/self/minuteBanks',
  VerifyToken,
  makeJSONExpressCallback.consume(makeGetMinuteBankController)
);

users.get('/:uId', VerifyToken, makeRedirectExpressCallback.consume(makeGetUserController));
users.post('/create', makeJSONCookieExpressCallback.consume(makeCreateUserController));
users.put('/:uId', VerifyToken, makeJSONExpressCallback.consume(makeEditUserController));
users.get(
  '/auth/emailToken/:verificationToken/verify',
  VerifyToken,
  makeRedirectExpressCallback.consume(makeVerifyEmailTokenController)
);

users.post('/auth/login', makeJSONCookieExpressCallback.consume(makeLoginUserController));
users.get('/auth/google', makeCookieRedirectExpressCallback.consume(makeLoginUserController));

export default users;
