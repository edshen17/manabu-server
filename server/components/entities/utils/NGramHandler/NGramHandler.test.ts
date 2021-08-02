import { expect } from 'chai';
import { makeNGramHandler } from '.';
import { NGramHandler } from './nGramHandler';

let nGramHandler: NGramHandler;
before(() => {
  nGramHandler = makeNGramHandler;
});

describe('createEdgeNGrams', () => {
  it('should create edge n-grams for the given string', () => {
    const str = 'Mississippi River';
    context('isOnlyPrefix', () => {
      const nGrams = nGramHandler.createEdgeNGrams({ str, isPrefixOnly: true });
      expect(nGrams).to.equal(
        'M Mi Mis Miss Missi Missis Mississ Mississi Mississip Mississipp Mississippi'
      );
    });
    context('default', () => {
      const nGrams = nGramHandler.createEdgeNGrams({ str, isPrefixOnly: false });
      expect(nGrams).to.equal(
        'M Mi Mis Miss Missi Missis Mississ Mississi Mississip Mississipp Mississippi R Ri Riv Rive River'
      );
    });
  });
});
