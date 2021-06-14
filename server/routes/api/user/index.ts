import express from 'express';
import { makeGetMinuteBankController } from '../../../components/controllers/minuteBank';
import {
  makeGetUserController,
  makePostUserController,
  makePutUserController,
} from '../../../components/controllers/user';
import { makeGetVerifyEmailTokenController } from '../../../components/controllers/user/auth';
import { makeExpressCallback } from '../../../components/expressCallback';
const users = express.Router();
const VerifyToken = require('../../../components/VerifyToken'); // TODO: turn into ts + import statement

users.get('/self/me', VerifyToken, makeExpressCallback(makeGetUserController));
users.get('/self/minuteBanks', VerifyToken, makeExpressCallback(makeGetMinuteBankController));

users.get('/:uId', VerifyToken, makeExpressCallback(makeGetUserController));
users.post('/register', makeExpressCallback(makePostUserController));
users.put('/:uId', VerifyToken, makeExpressCallback(makePutUserController));

users.get(
  '/auth/emailToken/:verificationToken/verify',
  VerifyToken,
  makeExpressCallback(makeGetVerifyEmailTokenController)
);

export default users;
