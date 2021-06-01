import jwt from 'jsonwebtoken';
import { userDbService, teacherDbService } from '../../dataAccess/index';
import { GetUserUsecase } from './getUserUsecase';
import { PostUserUsecase } from './postUserUsecase';
import { PutUserUsecase } from './putUserUsecase';
import { EmailHandler } from '../../utils/email/emailHandler';
import { IUsecaseService } from '../abstractions/IUsecaseService';

class UserUsecaseService implements IUsecaseService {
  public getUsecase: GetUserUsecase;
  public postUsecase: PostUserUsecase;
  public putUsecase: PutUserUsecase;
  constructor(usecases: any) {
    this.getUsecase = usecases.getUserUsecase;
    this.postUsecase = usecases.postUserUsecase;
    this.putUsecase = usecases.putUserUsecase;
  }
}

const getUserUsecase = new GetUserUsecase(userDbService);
const postUserUsecase = new PostUserUsecase(userDbService, teacherDbService, jwt, EmailHandler);
const putUserUsecase = new PutUserUsecase(userDbService);
const userUsecaseService = new UserUsecaseService({
  getUserUsecase,
  postUserUsecase,
  putUserUsecase,
});

export { userUsecaseService };
