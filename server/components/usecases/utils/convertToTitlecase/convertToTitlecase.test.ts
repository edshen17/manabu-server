import { expect } from 'chai';
import { convertToTitlecase } from '.';

describe('convertToTitlecase', () => {
  it('should titlecase the given string', () => {
    const convertedString = convertToTitlecase('converted string');
    expect(convertedString).to.equal('Converted String');
  });
});
