import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';

class RedirectCallbackDecorator extends AbstractExpressCallback {
  private abstractExpressCallback: AbstractExpressCallback;
  constructor(abstractExpressCallback: AbstractExpressCallback) {
    super();
    this.abstractExpressCallback = abstractExpressCallback;
  }
  public consumeTemplate = (res: any, body: any) => {
    this.abstractExpressCallback.consumeTemplate(res, body);
    if (!(body && 'redirectPath' in body)) {
      throw new Error('Redirect URI is not set. Make sure body has a redirectPath property.');
    }
    const { redirectPath } = body;

    return res.redirect(redirectPath);
  };
}

export { RedirectCallbackDecorator };
