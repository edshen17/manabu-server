import { makeQueryStringHandler } from '../queryStringHandler';
import { RedirectUrlBuilder } from './redirectUrlBuilder';

const makeRedirectUrlBuilder = new RedirectUrlBuilder().init({ makeQueryStringHandler });

export { makeRedirectUrlBuilder };
