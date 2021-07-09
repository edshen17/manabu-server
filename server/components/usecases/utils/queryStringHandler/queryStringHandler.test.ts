import { expect } from 'chai';
import { makeQueryStringHandler } from '.';
import { QueryStringHandler } from './queryStringHandler';

let queryStringHandler: QueryStringHandler;
let toQueryStringObj: {};
before(() => {
  queryStringHandler = makeQueryStringHandler;
});

beforeEach(() => {
  toQueryStringObj = {
    state: '',
    id: 'some id',
    test: {
      field: 'some field',
    },
  };
});

describe('queryStringHandler', () => {
  const encodeQueryStringObj = (unencodedQueryStrings: {}) => {
    const encodedQueryString = queryStringHandler.encodeQueryStringObj(unencodedQueryStrings);
    const decodedQueryString = queryStringHandler.decodeQueryString(encodedQueryString);
    expect(decodedQueryString).to.deep.equal(toQueryStringObj);
    return encodedQueryString;
  };

  const decodeQueryString = (encodedQueryStrings: string, expectedObj: {}) => {
    const decodedQueryString = queryStringHandler.decodeQueryString(encodedQueryStrings);
    expect(decodedQueryString).to.deep.equal(expectedObj);
    return decodedQueryString;
  };

  const stringifyQueryStringObj = (queryStrings: {}, expectedStr: string) => {
    const stringifiedQueryStringObj = queryStringHandler.stringifyQueryStringObj(queryStrings);
    expect(stringifiedQueryStringObj).to.equal(expectedStr);
  };

  const parseQueryString = (queryStrings: string, expectedObj: {}) => {
    const parsedQueryStrings = queryStringHandler.parseQueryString(queryStrings);
    expect(parsedQueryStrings).to.deep.equal(expectedObj);
  };

  const decodeQueryStringObj = (encodedQueryStringObj: {}, expectedObj: {}) => {
    const decodedQueryStringObj = queryStringHandler.decodeQueryStringObj(encodedQueryStringObj);
    expect(decodedQueryStringObj).to.deep.equal(expectedObj);
  };

  describe('encodeQueryStringObj', () => {
    context('empty query strings', () => {
      it('should encode the query strings', () => {
        toQueryStringObj = {};
        const encodedQueryStrings = encodeQueryStringObj(toQueryStringObj);
        expect(encodedQueryStrings).to.equal('');
      });
    });
    context('non-empty query strings', () => {
      it('should encode the query strings', () => {
        const encodedQueryStrings = encodeQueryStringObj(toQueryStringObj);
        expect(encodedQueryStrings).to.not.equal('');
      });
    });
  });
  describe('decodeQueryString', () => {
    context('empty encoded query strings', () => {
      it('should decode the query strings', () => {
        toQueryStringObj = {};
        const encodedQueryString = queryStringHandler.encodeQueryStringObj(toQueryStringObj);
        decodeQueryString(encodedQueryString, toQueryStringObj);
      });
    });
    context('non-empty encoded query strings', () => {
      it('should decode the query strings', () => {
        const encodedQueryString = queryStringHandler.encodeQueryStringObj(toQueryStringObj);
        decodeQueryString(encodedQueryString, toQueryStringObj);
      });
    });
  });
  describe('decodeQueryStringObj', () => {
    context('empty query strings', () => {
      it('should parse the query strings', () => {
        toQueryStringObj = {};
        const encodedQueryString = queryStringHandler.encodeQueryStringObj(toQueryStringObj);
        const parsedQueryString = queryStringHandler.parseQueryString(encodedQueryString);
        decodeQueryStringObj(parsedQueryString, toQueryStringObj);
      });
    });
    context('non-empty query strings', () => {
      it('should parse the query strings', () => {
        const encodedQueryString = queryStringHandler.encodeQueryStringObj(toQueryStringObj);
        const parsedQueryString = queryStringHandler.parseQueryString(encodedQueryString);
        decodeQueryStringObj(parsedQueryString, toQueryStringObj);
      });
    });
  });
  describe('stringifyQueryStringObj', () => {
    context('empty query strings', () => {
      it('should stringify the query object', () => {
        toQueryStringObj = {};
        stringifyQueryStringObj(toQueryStringObj, '');
      });
    });
    context('non-empty query strings', () => {
      it('should stringify the query object', () => {
        stringifyQueryStringObj(toQueryStringObj, 'id=some%20id&state=&test=%5Bobject%20Object%5D');
      });
    });
  });

  describe('parseQueryString', () => {
    context('empty query strings', () => {
      it('should parse the query strings', () => {
        const queryString = '';
        const expectedObj = {};
        parseQueryString(queryString, expectedObj);
      });
    });
    context('non-empty query strings', () => {
      it('should parse the query strings', () => {
        const queryString = '?foo=bar';
        const expectedObj = { foo: 'bar' };
        parseQueryString(queryString, expectedObj);
      });
    });
  });
});
