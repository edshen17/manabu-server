import { IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { ControllerData, IUsecase } from './IUsecase';

export abstract class AbstractUsecase<DbDoc> implements IUsecase<DbDoc> {
  protected dbService!: IDbOperations<DbDoc>;
  public build = async (makeDbService: IDbOperations<DbDoc>): Promise<this> => {
    this.dbService = await makeDbService;
    return this;
  };
  abstract makeRequest(controllerData: ControllerData): Promise<DbDoc>;
}
