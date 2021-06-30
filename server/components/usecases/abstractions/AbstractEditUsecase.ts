import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractEditUsecase<UsecaseInitParams, UsecaseResponse> extends AbstractUsecase<
  UsecaseInitParams,
  UsecaseResponse
> {
  constructor() {
    super('Access denied.');
  }
}

export { AbstractEditUsecase };
