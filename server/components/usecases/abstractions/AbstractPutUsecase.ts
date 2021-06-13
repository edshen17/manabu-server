import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractPutUsecase<UsecaseResponse> extends AbstractUsecase<UsecaseResponse> {
  constructor() {
    super('Access denied.');
  }
}

export { AbstractPutUsecase };
