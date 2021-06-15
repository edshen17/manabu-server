import { makeUserDbService } from '../../../dataAccess';
import { VerifyEmailTokenUsecase } from './verifyEmailTokenUsecase';

const makeVerifyEmailTokenUsecase = new VerifyEmailTokenUsecase().init({
  makeUserDbService,
});

export { makeVerifyEmailTokenUsecase };
