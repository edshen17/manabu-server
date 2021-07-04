import { makeQueryStringHandler } from '../queryStringHandler';
import { RedirectPathBuilder } from './redirectPathBuilder';

const makeRedirectPathBuilder = new RedirectPathBuilder().init({ makeQueryStringHandler });

export { makeRedirectPathBuilder };
