import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';

class ExpressCallback extends AbstractExpressCallback {
  public consumeTemplate = (res: any, body: any): void => {
    return;
  };
}

export { ExpressCallback };
