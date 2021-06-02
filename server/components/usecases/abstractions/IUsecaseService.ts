import { IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { IUsecase } from './IUsecase';

export interface IUsecaseService {
  getUsecase: IUsecase;
  postUsecase: IUsecase;
  putUsecase: IUsecase;
  deleteUsecase?: IUsecase;
  build: (services: any) => Promise<this>;
}
