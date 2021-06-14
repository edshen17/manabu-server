import express from 'express';
import { makeGetMinuteBankController } from '../../../components/controllers/minuteBank';
import {
  makeGetUserController,
  makePostUserController,
  makePutUserController,
} from '../../../components/controllers/user';
import { makeGetVerifyEmailTokenController } from '../../../components/controllers/user/auth';
import { makeExpressCallback } from '../../../components/expressCallback/callbacks';
import { makeAuthCookieExpressCallback } from '../../../components/expressCallback/callbacks/cookieCallbacks';
const users = express.Router();
const VerifyToken = require('../../../components/VerifyToken'); // TODO: turn into ts + import statement

users.get('/self/me', VerifyToken, makeExpressCallback.consume(makeGetUserController));
users.get(
  '/self/minuteBanks',
  VerifyToken,
  makeExpressCallback.consume(makeGetMinuteBankController)
);

users.get('/:uId', VerifyToken, makeExpressCallback.consume(makeGetUserController));
users.post('/register', makeAuthCookieExpressCallback.consume(makePostUserController));
users.put('/:uId', VerifyToken, makeExpressCallback.consume(makePutUserController));

users.get(
  '/auth/emailToken/:verificationToken/verify',
  VerifyToken,
  makeExpressCallback.consume(makeGetVerifyEmailTokenController)
);

export default users;
