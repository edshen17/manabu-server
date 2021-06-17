import { google } from 'googleapis';
import { makeCreateUserUsecase } from '..';
import { makeUserDbService } from '../../../dataAccess';
import { makeRedirectPathBuilder } from '../../../utils/redirectPathBuilder';
import { LoginUserUsecase } from './loginUserUsecase';
import { VerifyEmailTokenUsecase } from './verifyEmailTokenUsecase';

const oauthRedirectURI = makeRedirectPathBuilder
  .host('server')
  .endpointPath('/users/auth/google')
  .build();

const oauth2Client = new google.auth.OAuth2(
  process.env.G_CLIENTID,
  process.env.GOOGLE_CLIENT_SECRET,
  oauthRedirectURI
);

const makeVerifyEmailTokenUsecase = new VerifyEmailTokenUsecase().init({
  makeUserDbService,
  makeRedirectPathBuilder,
});

const makeLoginUserUsecase = new LoginUserUsecase().init({
  makeUserDbService,
  makeCreateUserUsecase,
  oauth2Client,
  google,
});

export { makeVerifyEmailTokenUsecase, makeLoginUserUsecase };
