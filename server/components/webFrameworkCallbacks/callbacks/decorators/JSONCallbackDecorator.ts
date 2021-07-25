import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';

class JSONCallbackDecorator extends AbstractExpressCallback {
  private abstractExpressCallback: AbstractExpressCallback;
  constructor(abstractExpressCallback: AbstractExpressCallback) {
    super();
    this.abstractExpressCallback = abstractExpressCallback;
  }
  public consumeTemplate = (res: any, body: any) => {
    this.abstractExpressCallback.consumeTemplate(res, body);
    const { cookies, redirectUrl, ...filteredBody } = body;
    res.json(filteredBody);
  };
}

export { JSONCallbackDecorator };
