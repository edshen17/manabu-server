import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractGetUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse> {
  constructor() {
    super('Resource not found.');
  }

  protected _isProtectedResource = (): boolean => {
    return false;
  };
}

export { AbstractGetUsecase };
