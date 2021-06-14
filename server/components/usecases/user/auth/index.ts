import { makeUserDbService } from '../../../dataAccess';
import { GetVerifyEmailTokenUsecase } from './getVerifyEmailTokenUsecase';

const makeGetVerifyEmailTokenUsecase = new GetVerifyEmailTokenUsecase().init({
  makeUserDbService,
});

export { makeGetVerifyEmailTokenUsecase };
