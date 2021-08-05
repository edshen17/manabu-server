import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractDeleteUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse> {
  constructor() {
    super('Resource to delete not found.');
  }
}

export { AbstractDeleteUsecase };
