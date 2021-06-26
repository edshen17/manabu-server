import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeRedirectPathBuilder } from '../../utils/redirectPathBuilder';
import { VerifyEmailTokenUsecase } from './verifyEmailTokenUsecase';

const makeVerifyEmailTokenUsecase = new VerifyEmailTokenUsecase().init({
  makeUserDbService,
  makeRedirectPathBuilder,
});

export { makeVerifyEmailTokenUsecase };
