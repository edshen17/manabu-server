import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { makeRedirectUrlBuilder } from '../../utils/redirectUrlBuilder';
import { VerifyEmailTokenUsecase } from './verifyEmailTokenUsecase';

const makeVerifyEmailTokenUsecase = new VerifyEmailTokenUsecase().init({
  makeUserDbService,
  makeRedirectUrlBuilder,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
});

export { makeVerifyEmailTokenUsecase };
