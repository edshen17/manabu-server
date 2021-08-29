import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { google } from 'googleapis';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeUserQueryValidator } from '../../../validators/user/query';
import { makeRedirectUrlBuilder } from '../../utils/redirectUrlBuilder';
import { makeCreateUserUsecase } from '../createUserUsecase';
import { LoginUserUsecase } from './loginUserUsecase';

const oauthRedirectURI = makeRedirectUrlBuilder
  .host('server')
  .endpoint('/users/auth/google/login')
  .build();

const oauth2Client = new google.auth.OAuth2(
  process.env.G_CLIENTID,
  process.env.GOOGLE_CLIENT_SECRET,
  oauthRedirectURI
);

const makeLoginUserUsecase = new LoginUserUsecase().init({
  makeDbService: makeUserDbService,
  makeCreateUserUsecase,
  oauth2Client,
  google,
  makeRedirectUrlBuilder,
  cloneDeep,
  makeQueryValidator: makeUserQueryValidator,
  makeParamsValidator: makeBaseParamsValidator,
  deepEqual,
});

export { makeLoginUserUsecase };
