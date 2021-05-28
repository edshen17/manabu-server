import { IUsecase } from './IUsecase';

export interface IUsecaseService {
  getUsecase: IUsecase;
  postUsecase: IUsecase;
  putUsecase: IUsecase;
  deleteUsecase?: IUsecase;
}
