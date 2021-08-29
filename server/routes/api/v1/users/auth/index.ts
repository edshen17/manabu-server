import express from 'express';
import { makeLoginUserController } from '../../../../../components/controllers/user/loginUserController';
import { makeVerifyEmailTokenController } from '../../../../../components/controllers/user/verifyEmailTokenController';
import {
  makeCookieRedirectExpressCallback,
  makeRedirectExpressCallback,
} from '../../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
const auth = express.Router();

auth.get(
  '/emailToken/:verificationToken/verify',
  makeRedirectExpressCallback.consume(makeVerifyEmailTokenController)
);
auth.post('/base/login', makeCookieRedirectExpressCallback.consume(makeLoginUserController));
auth.get('/google/login', makeCookieRedirectExpressCallback.consume(makeLoginUserController));

export { auth };
