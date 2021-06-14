import { getServerHostURI } from '../../utils/getHost';
import { RedirectExpressCallbackBuilder } from './builders/redirectExpressCallbackBuilder';

const clientHostURI = getServerHostURI('client')!;
const apiHostURI = getServerHostURI('server')!;

const makeRedirectExpressCallbackBuilder = new RedirectExpressCallbackBuilder();
const makeRedirectExpressCallbackDashboard = makeRedirectExpressCallbackBuilder
  .host(clientHostURI)
  .endpointPath('/dashboard')
  .build();

export { makeRedirectExpressCallbackDashboard };
