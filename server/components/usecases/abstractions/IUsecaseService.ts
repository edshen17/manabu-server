import { IUsecase } from './IUsecase';

export interface IUsecaseService<DbDoc> {
  getUsecase: IUsecase<DbDoc>;
  postUsecase: IUsecase<DbDoc>;
  putUsecase: IUsecase<DbDoc>;
  deleteUsecase?: IUsecase<DbDoc>;
}
