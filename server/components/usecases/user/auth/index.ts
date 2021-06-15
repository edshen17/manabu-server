import { makeCreateUserUsecase } from '..';
import { makeUserDbService } from '../../../dataAccess';
import { LoginUserUsecase } from './loginUserUsecase';
import { VerifyEmailTokenUsecase } from './verifyEmailTokenUsecase';
const makeVerifyEmailTokenUsecase = new VerifyEmailTokenUsecase().init({
  makeUserDbService,
});

const makeLoginUserUsecase = new LoginUserUsecase().init({
  makeUserDbService,
  makeCreateUserUsecase,
});

export { makeVerifyEmailTokenUsecase, makeLoginUserUsecase };
