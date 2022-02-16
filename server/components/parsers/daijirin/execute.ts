import { makeDaijirinParser } from '.';

(async () => {
  const daijirinParser = await makeDaijirinParser;
  daijirinParser.parse();
})();
