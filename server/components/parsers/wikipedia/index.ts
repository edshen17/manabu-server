import bluebird from 'bluebird';
import fs from 'fs';
import jsStringEscape from 'js-string-escape';
import lzString from 'lz-string';
import striptags from 'striptags';
import wiki from 'wikijs';
import { GCS_KEYFILE } from '../../../constants';
import { makeContentDbService } from '../../dataAccess/services/content';
import { makeGraphDbService } from '../../dataAccess/services/graph';
import { makeContentEntity } from '../../entities/content';
import { WikipediaParser } from './wikipediaParser';

const xmlStream = require('xml-stream');

const language = require('@google-cloud/language');
const gcsKeyfile = JSON.parse(GCS_KEYFILE);
const { project_id, private_key, client_email } = gcsKeyfile;
const googleLangClient = new language.LanguageServiceClient({
  projectId: project_id,
  credentials: {
    client_email,
    private_key,
  },
});

const makeWikipediaParser = new WikipediaParser().init({
  fs,
  xmlStream,
  wiki,
  makeContentEntity,
  googleLangClient,
  makeContentDbService,
  makeGraphDbService,
  lzString,
  striptags,
  bluebird,
  jsStringEscape,
});

export { makeWikipediaParser, googleLangClient };
