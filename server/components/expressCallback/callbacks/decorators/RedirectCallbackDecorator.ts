import { AbstractExpressCallback } from '../../abstractions/AbstractExpressCallback';

class RedirectCallbackDecorator extends AbstractExpressCallback {
  private abstractExpressCallback: AbstractExpressCallback;
  constructor(abstractExpressCallback: AbstractExpressCallback) {
    super();
    this.abstractExpressCallback = abstractExpressCallback;
  }
  public consumeTemplate = (res: any, body: any) => {
    this.abstractExpressCallback.consumeTemplate(res, body);
    if (!(body && 'redirectURI' in body)) {
      throw new Error('Redirect URI is not set. Make sure body has a redirectURI property.');
    }
    const { redirectURI } = body;

    return res.redirect(redirectURI);
  };
}

export { RedirectCallbackDecorator };
