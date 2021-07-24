import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { makeRedirectPathBuilder } from '../../utils/redirectPathBuilder';
import { VerifyEmailTokenUsecase } from './verifyEmailTokenUsecase';

const makeVerifyEmailTokenUsecase = new VerifyEmailTokenUsecase().init({
  makeUserDbService,
  makeRedirectPathBuilder,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
});

export { makeVerifyEmailTokenUsecase };
