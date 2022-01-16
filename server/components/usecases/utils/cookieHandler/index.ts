import { makeJwtHandler } from '../jwtHandler';
import { CookieHandler } from './cookieHandler';

const makeCookieHandler = new CookieHandler().init({
  makeJwtHandler,
});

export { makeCookieHandler };
