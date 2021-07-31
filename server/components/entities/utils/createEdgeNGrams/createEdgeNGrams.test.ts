import { expect } from 'chai';
import { createEdgeNGrams } from '.';

describe('createEdgeNGrams', () => {
  it('should create edge n grams for the given string', () => {
    const nGrams = createEdgeNGrams('Mississippi River');
    expect(nGrams).to.equal(
      'Mis Miss Missi Missis Mississ Mississi Mississip Mississipp Mississippi Riv Rive River'
    );
  });
});
