import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractGetUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbService
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbService> {
  constructor() {
    super('Resource not found.');
  }
}

export { AbstractGetUsecase };
