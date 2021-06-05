import { IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { IUsecase } from './IUsecase';

export interface IUsecaseService {
  getUsecase: IUsecase;
  postUsecase: IUsecase;
  putUsecase: IUsecase;
  deleteUsecase?: IUsecase;
  init: (services: any) => Promise<this>;
}
