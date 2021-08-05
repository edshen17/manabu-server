import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractDeleteUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbService
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbService> {
  constructor() {
    super('Resource to delete not found.');
  }
}

export { AbstractDeleteUsecase };
