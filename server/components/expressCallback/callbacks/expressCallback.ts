import { AbstractExpressCallback } from '../abstractions/AbstractExpressCallback';

class ExpressCallback extends AbstractExpressCallback {
  protected _consumeTemplate = (res: any, body: any) => {};
}

export { ExpressCallback };
