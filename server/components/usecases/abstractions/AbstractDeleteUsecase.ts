import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractDeleteUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse> {}

export { AbstractDeleteUsecase };
