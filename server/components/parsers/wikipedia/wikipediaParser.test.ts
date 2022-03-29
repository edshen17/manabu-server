import { makeWikipediaParser } from '.';
import { WikipediaParser } from './wikipediaParser';

let wikipediaParser: WikipediaParser;

before(async () => {
  wikipediaParser = await makeWikipediaParser;
});

describe('wikipediaParser', () => {
  it('should create correspoding databases from wikipedia xml', async () => {
    await wikipediaParser.populateDb();
  });
});
