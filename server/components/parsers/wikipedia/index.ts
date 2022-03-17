import fs from 'fs';
import wiki from 'wikijs';
import { makeContentEntity } from '../../entities/content';
import { WikipediaParser } from './wikipediaParser';
const xmlStream = require('xml-stream');

const makeWikipediaParser = new WikipediaParser().init({
  fs,
  xmlStream,
  wiki,
  makeContentEntity,
});

export { makeWikipediaParser };
