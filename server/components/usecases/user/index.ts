import jwt from 'jsonwebtoken';
import {
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
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

  public init = async (services: {
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

const makeGetUserUsecase = new GetUserUsecase().init({ makeUserDbService });
const makePostUserUsecase = new PostUserUsecase().init({
  makeUserDbService,
  makeTeacherDbService,
  makePackageDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
  jwt,
  emailHandler,
});
const makePutUserUsecase = new PutUserUsecase().init({ makeUserDbService });

const userUsecaseService = new UserUsecaseService().init({
  makeGetUserUsecase,
  makePostUserUsecase,
  makePutUserUsecase,
});

export { userUsecaseService };
