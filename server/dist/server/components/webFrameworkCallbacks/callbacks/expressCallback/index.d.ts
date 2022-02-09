import { CookieCallbackDecorator } from '../decorators/CookieCallbackDecorator';
import { JSONCallbackDecorator } from '../decorators/JSONCallbackDecorator';
import { RedirectCallbackDecorator } from '../decorators/RedirectCallbackDecorator';
declare const makeCookieExpressCallback: CookieCallbackDecorator;
declare const makeRedirectExpressCallback: RedirectCallbackDecorator;
declare const makeCookieRedirectExpressCallback: CookieCallbackDecorator;
declare const makeJSONExpressCallback: JSONCallbackDecorator;
declare const makeJSONCookieExpressCallback: JSONCallbackDecorator;
export { makeCookieExpressCallback, makeRedirectExpressCallback, makeCookieRedirectExpressCallback, makeJSONExpressCallback, makeJSONCookieExpressCallback, };
