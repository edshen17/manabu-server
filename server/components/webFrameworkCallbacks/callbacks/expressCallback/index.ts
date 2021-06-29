import { CookieCallbackDecorator } from '../decorators/CookieCallbackDecorator';
import { JSONCallbackDecorator } from '../decorators/JSONCallbackDecorator';
import { RedirectCallbackDecorator } from '../decorators/RedirectCallbackDecorator';
import { ExpressCallback } from './expressCallback';

const makeExpressCallback = new ExpressCallback();
const makeCookieExpressCallback = new CookieCallbackDecorator(makeExpressCallback);
const makeRedirectExpressCallback = new RedirectCallbackDecorator(makeExpressCallback);
const makeCookieRedirectExpressCallback = new CookieCallbackDecorator(makeRedirectExpressCallback);
const makeJSONExpressCallback = new JSONCallbackDecorator(makeExpressCallback);
const makeJSONCookieExpressCallback = new JSONCallbackDecorator(makeCookieExpressCallback);

export {
  makeCookieExpressCallback,
  makeRedirectExpressCallback,
  makeCookieRedirectExpressCallback,
  makeJSONExpressCallback,
  makeJSONCookieExpressCallback,
};
