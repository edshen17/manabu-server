import express from 'express';
import { makeGetMinuteBankController } from '../../../components/controllers/minuteBank';
import {
  makeGetUserController,
  makeCreateUserController,
  makeEditUserController,
} from '../../../components/controllers/user';
import {
  makeLoginUserController,
  makeVerifyEmailTokenController,
} from '../../../components/controllers/user/auth';
import { makeExpressCallback } from '../../../components/expressCallback/callbacks';
import { makeAuthCookieExpressCallback } from '../../../components/expressCallback/callbacks/cookieCallbacks';
import { makeRedirectExpressCallbackDashboard } from '../../../components/expressCallback/callbacks/redirectCallbacks';

const users = express.Router();
const VerifyToken = require('../../../components/VerifyToken'); // TODO: turn into ts + import statement

users.get('/self/me', VerifyToken, makeExpressCallback.consume(makeGetUserController));
users.get(
  '/self/minuteBanks',
  VerifyToken,
  makeExpressCallback.consume(makeGetMinuteBankController)
);

users.get('/:uId', VerifyToken, makeExpressCallback.consume(makeGetUserController));
users.post('/register', makeAuthCookieExpressCallback.consume(makeCreateUserController));
users.put('/:uId', VerifyToken, makeExpressCallback.consume(makeEditUserController));

users.get(
  '/auth/emailToken/:verificationToken/verify',
  VerifyToken,
  makeRedirectExpressCallbackDashboard.consume(makeVerifyEmailTokenController)
);

users.post('/auth/login', makeExpressCallback.consume(makeLoginUserController));

export default users;
