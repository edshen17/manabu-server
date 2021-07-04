import { expect } from 'chai';
import { makeQueryStringHandler } from '.';
import { QueryStringHandler } from './queryStringHandler';

let queryStringHandler: QueryStringHandler;
let defaultQueryStrings: {};
before(() => {
  queryStringHandler = makeQueryStringHandler;
});

beforeEach(() => {
  defaultQueryStrings = {
    state: 'some state',
    id: 'some id',
  };
});

describe('queryStringHandler', () => {
  const encodeQueryStrings = (unencodedQueryStrings: {}) => {
    const encodedQueryStrings = queryStringHandler.encodeQueryStrings(unencodedQueryStrings);
    const decodedQueryStrings = queryStringHandler.decodeQueryStrings(encodedQueryStrings);
    expect(decodedQueryStrings).to.deep.equal(defaultQueryStrings);
    return encodedQueryStrings;
  };

  const decodeQueryStrings = (encodedQueryStrings: string, expectedObj: {}) => {
    const decodedQueryStrings = queryStringHandler.decodeQueryStrings(encodedQueryStrings);
    expect(decodedQueryStrings).to.deep.equal(expectedObj);
    return decodedQueryStrings;
  };

  const stringifyQueryStrings = (queryStrings: {}, expectedStr: string) => {
    const stringifiedQueryStrings = queryStringHandler.stringifyQueryStrings(queryStrings);
    expect(stringifiedQueryStrings).to.equal(expectedStr);
  };

  const parseQueryStrings = (queryStrings: string, expectedObj: {}) => {
    const parsedQueryStrings = queryStringHandler.parseQueryStrings(queryStrings);
    expect(parsedQueryStrings).to.deep.equal(expectedObj);
  };

  describe('encodeQueryStrings', () => {
    context('empty query strings', () => {
      it('should encode the query strings', () => {
        defaultQueryStrings = {};
        const encodedQueryStrings = encodeQueryStrings(defaultQueryStrings);
        expect(encodedQueryStrings).to.equal('');
      });
    });
    context('non-empty query strings', () => {
      it('should encode the query strings', () => {
        const encodedQueryStrings = encodeQueryStrings(defaultQueryStrings);
        expect(encodedQueryStrings).to.not.equal('');
      });
    });
  });
  describe('decodeQueryStrings', () => {
    context('empty encoded query strings', () => {
      it('should decode the query strings', () => {
        defaultQueryStrings = {};
        const encodedQueryString = queryStringHandler.encodeQueryStrings(defaultQueryStrings);
        decodeQueryStrings(encodedQueryString, defaultQueryStrings);
      });
    });
    context('non-empty encoded query strings', () => {
      it('should decode the query strings', () => {
        const encodedQueryString = queryStringHandler.encodeQueryStrings(defaultQueryStrings);
        decodeQueryStrings(encodedQueryString, defaultQueryStrings);
      });
    });
  });
  describe('stringifyQueryStrings', () => {
    context('empty query strings', () => {
      it('should stringify the query object', () => {
        defaultQueryStrings = {};
        stringifyQueryStrings(defaultQueryStrings, '');
      });
    });
    context('non-empty query strings', () => {
      it('should stringify the query object', () => {
        stringifyQueryStrings(defaultQueryStrings, 'id=some%20id&state=some%20state');
      });
    });
  });

  describe('parseQueryStrings', () => {
    context('empty query strings', () => {
      it('should parse the query strings', () => {
        const queryString = '';
        const expectedObj = {};
        parseQueryStrings(queryString, expectedObj);
      });
    });
    context('non-empty query strings', () => {
      it('should parse the query strings', () => {
        const queryString = '?foo=bar';
        const expectedObj = { foo: 'bar' };
        parseQueryStrings(queryString, expectedObj);
      });
    });
  });
});
