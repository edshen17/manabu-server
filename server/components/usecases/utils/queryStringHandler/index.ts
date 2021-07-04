import { parse as parseQueryString, stringify as stringifyQueryString } from 'query-string';
import { QueryStringHandler } from './queryStringHandler';

const makeQueryStringHandler = new QueryStringHandler().init({
  parseQueryString,
  stringifyQueryString,
});

export { makeQueryStringHandler };
