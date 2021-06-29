import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';

class CookieCallbackDecorator extends AbstractExpressCallback {
  private abstractExpressCallback: AbstractExpressCallback;
  constructor(abstractExpressCallback: AbstractExpressCallback) {
    super();
    this.abstractExpressCallback = abstractExpressCallback;
  }
  public consumeTemplate = (res: any, body: any) => {
    if (!(body && body.cookies)) {
      throw new Error('Client cookies are not set. Make sure body has a cookies property.');
    }

    const { cookies } = body;
    for (const cookie of cookies) {
      const { name, value, options } = cookie;
      res.cookie(name, value, options);
    }
    this.abstractExpressCallback.consumeTemplate(res, body);
  };
}

export { CookieCallbackDecorator };
