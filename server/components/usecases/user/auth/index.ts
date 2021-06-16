import { google } from 'googleapis';
import { makeCreateUserUsecase } from '..';
import { makeUserDbService } from '../../../dataAccess';
import { getServerHostURI } from '../../../expressCallback/utils/getHost';
import { LoginUserUsecase } from './loginUserUsecase';
import { VerifyEmailTokenUsecase } from './verifyEmailTokenUsecase';

const oauth2Client = new google.auth.OAuth2(
  process.env.G_CLIENTID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${getServerHostURI('server')}/api/users/auth/google`
);

const makeVerifyEmailTokenUsecase = new VerifyEmailTokenUsecase().init({
  makeUserDbService,
});

const makeLoginUserUsecase = new LoginUserUsecase().init({
  makeUserDbService,
  makeCreateUserUsecase,
  oauth2Client,
  google,
});

export { makeVerifyEmailTokenUsecase, makeLoginUserUsecase };
