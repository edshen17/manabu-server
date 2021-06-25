import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractEditUsecase<UsecaseResponse> extends AbstractUsecase<UsecaseResponse> {
  constructor() {
    super('Access denied.');
  }
}

export { AbstractEditUsecase };
