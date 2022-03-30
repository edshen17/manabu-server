import { makeWikipediaParser } from '.';
import { WikipediaParser } from './wikipediaParser';

let wikipediaParser: WikipediaParser;

before(async () => {
  wikipediaParser = await makeWikipediaParser;
});

describe('wikipediaParser', () => {
  it('should create correspoding databases from wikipedia xml', async () => {
    await wikipediaParser.populateDb();
    // const jsonobj = [
    //   {
    //     sample: 'This is supposed to be ling string',
    //     score: 'another long string which is going to be compressed',
    //   },
    // ];

    // const string = LZString.decompress(LZString.compress(JSON.stringify(jsonobj)))!;

    // // parse it to JSON object
    // console.log(JSON.parse(string));
  });
});
