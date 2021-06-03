import jwt from 'jsonwebtoken';
import {
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
} from '../../dataAccess/index';
import { GetUserUsecase } from './getUserUsecase';
import { PostUserUsecase } from './postUserUsecase';
import { PutUserUsecase } from './putUserUsecase';
import { emailHandler } from '../../utils/email/emailHandler';
import { IUsecaseService } from '../abstractions/IUsecaseService';

class UserUsecaseService implements IUsecaseService {
  public getUsecase!: GetUserUsecase;
  public postUsecase!: PostUserUsecase;
  public putUsecase!: PutUserUsecase;

  public build = async (services: {
    makeGetUserUsecase: Promise<GetUserUsecase>;
    makePostUserUsecase: Promise<PostUserUsecase>;
    makePutUserUsecase: Promise<PutUserUsecase>;
  }): Promise<this> => {
    this.getUsecase = await services.makeGetUserUsecase;
    this.postUsecase = await services.makePostUserUsecase;
    this.putUsecase = await services.makePutUserUsecase;
    return this;
  };
}

const makeGetUserUsecase = new GetUserUsecase().build({ makeUserDbService });
const makePostUserUsecase = new PostUserUsecase().build({
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  jwt,
  emailHandler,
});
const makePutUserUsecase = new PutUserUsecase().build({ makeUserDbService });

const userUsecaseService = new UserUsecaseService().build({
  makeGetUserUsecase,
  makePostUserUsecase,
  makePutUserUsecase,
});

export { userUsecaseService };
