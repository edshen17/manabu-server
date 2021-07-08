import queryStringLib from 'query-string';
import { QueryStringHandler } from './queryStringHandler';

const makeQueryStringHandler = new QueryStringHandler().init({
  queryStringLib,
});

export { makeQueryStringHandler };
