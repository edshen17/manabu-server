import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { google } from 'googleapis';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeUserQueryValidator } from '../../../validators/user/query';
import { makeCookieHandler } from '../../utils/cookieHandler';
import { makeRedirectUrlBuilder } from '../../utils/redirectUrlBuilder';
import { makeCreateUserUsecase } from '../createUserUsecase';
import { LoginUserUsecase } from './loginUserUsecase';

const makeLoginUserUsecase = new LoginUserUsecase().init({
  makeDbService: makeUserDbService,
  makeCreateUserUsecase,
  google,
  makeRedirectUrlBuilder,
  cloneDeep,
  makeQueryValidator: makeUserQueryValidator,
  makeParamsValidator: makeBaseParamsValidator,
  deepEqual,
  makeCookieHandler,
});

export { makeLoginUserUsecase };
