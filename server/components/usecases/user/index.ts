import { GetUserUsecase } from './getUserUsecase';
import { makeUserDbService } from '../../dataAccess/services/user';

const makeGetUserUsecase = new GetUserUsecase().init({ makeUserDbService });

export { makeGetUserUsecase };
