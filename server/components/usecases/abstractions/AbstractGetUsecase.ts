import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractGetUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse> {
  protected _isProtectedResource = (): boolean => {
    return false;
  };
}

export { AbstractGetUsecase };
