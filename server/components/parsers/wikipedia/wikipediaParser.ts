import bluebird from 'bluebird';
import striptags from 'striptags';
import wiki, { Link } from 'wikijs';
import { MANABU_ADMIN_ID } from '../../../constants';
import { ContentDoc } from '../../../models/Content';
import { StringKeyObject } from '../../../types/custom';
import { ContentDbService } from '../../dataAccess/services/content/contentDbService';
import {
  ContentEntity,
  CONTENT_ENTITY_OWNERSHIP,
  CONTENT_ENTITY_TYPE,
} from '../../entities/content/contentEntity';
const WT2PT = require('wikitext2plaintext');

type WikipediaArticle = {
  title: StringKeyObject;
  ns: StringKeyObject;
  id: StringKeyObject;
  revision: {
    id: StringKeyObject;
    parentId: StringKeyObject;
    timestamp: StringKeyObject;
    constributor: { username: string; id: string };
    model: StringKeyObject;
    format: StringKeyObject;
    text: {
      $: StringKeyObject;
      $text: string;
    };
    sha1: StringKeyObject;
  };
};

type CreateContentParams = {
  title: string;
  strippedWikiText: string;
};

type GoogleLangClientParams = { content: string; type: string };

class WikipediaParser {
  private _fs!: any;
  private _fsPromises!: any;
  private _xmlStream!: any;
  private _lzString!: any;
  private _wiki!: typeof wiki;
  private _contentEntity!: ContentEntity;
  private _contentDbService!: ContentDbService;
  private _googleLangClient!: any;
  private _bluebird!: typeof bluebird;
  private _striptags!: typeof striptags;

  public populateDb = async (): Promise<void> => {
    const dataPath = `${__dirname}/../data/wikipedia`;
    const fileNames: string[] = await this._fsPromises.readdir(dataPath);
    let count = 0;
    for (const fileName of fileNames) {
      if (fileName.includes('1.xml')) {
        const promiseArr: Promise<ContentDoc>[] = [];
        const self = this;
        const xmlStream = new Promise(function (resolve) {
          const stream = self._fs.createReadStream(`${dataPath}/${fileName}`);
          const xml = new self._xmlStream(stream);
          xml.preserve('page', true);
          xml.on('endElement: page', async (wikipediaArticle: WikipediaArticle) => {
            if (wikipediaArticle.ns.$text == '0' && count < 200) {
              count++;
              const { revision } = wikipediaArticle;
              const title = wikipediaArticle.title.$text;
              const wikiText = revision.text.$text;
              const wt = new WT2PT();
              wt.exclude_rule('HEADER_TAGS');
              wt.exclude_rule('FILE_LINKS');
              const parsedWikiText = wt.parse(wikiText);
              const strippedWikiText = self
                ._striptags(parsedWikiText, '<gallery>')
                .replace(/\[\[(.*?)\]\]/gms, '')
                .replace(/<gallery>(.*?)<\/gallery>/gms, '');
              promiseArr.push(self._createContent({ title, strippedWikiText }));
            }
          });
          xml.on('end', () => {
            resolve(undefined);
          });
        });
        await xmlStream;
        await this._bluebird.Promise.map(
          promiseArr,
          () => {
            console.log('done');
          },
          { concurrency: 1 }
        );
      }
    }
  };

  private _createContent = async (props: CreateContentParams): Promise<ContentDoc> => {
    const { title } = props;
    const dbServiceAccessOptions = this._contentDbService.getBaseDbServiceAccessOptions();
    const content = await this._contentDbService.findOne({
      searchQuery: {
        title,
      },
      dbServiceAccessOptions,
    });
    if (!content) {
      const { tokens, tokenSaliences, summary, coverImageUrl, categories } =
        await this._getWikiArticleData(props);
      const contentEntity = await this._contentEntity.build({
        postedById: MANABU_ADMIN_ID as any,
        title,
        coverImageUrl,
        sourceUrl: `https://ja.wikipedia.org/wiki/${encodeURIComponent(title)}`,
        language: 'ja',
        summary,
        tokens,
        tokenSaliences,
        categories,
        ownership: CONTENT_ENTITY_OWNERSHIP.PUBLIC,
        author: 'Wikipedia',
        type: CONTENT_ENTITY_TYPE.WIKIPEDIA,
      });
      const savedDbContent = await this._contentDbService.insert({
        modelToInsert: contentEntity,
        dbServiceAccessOptions,
      });
      console.log('insert');
      return savedDbContent;
    } else {
      console.log('inserted');
      return content;
    }
  };

  private _getWikiArticleData = async (props: CreateContentParams) => {
    const { title, strippedWikiText } = props;
    const wiki = await this._wiki({
      apiUrl: 'https://ja.wikipedia.org/w/api.php',
    }).page(title);
    const coverImageUrl = await wiki.mainImage();
    const sourceUrl = wiki.url();
    const summary = await wiki.summary();
    let langLinks: Link[] = [];
    try {
      langLinks = await wiki.langlinks();
    } catch (err) {
      langLinks = [];
    }
    const document = {
      content: strippedWikiText,
      type: 'PLAIN_TEXT',
    };
    const tokens = await this._getTokens(document);
    const decompressedTokens = this._lzString.decompress(tokens);
    const tokenSaliences = await this._getTokenSaliences(JSON.parse(decompressedTokens));
    const categories = await this._getCategories(langLinks);
    const wikiData = {
      coverImageUrl,
      sourceUrl,
      summary,
      tokens,
      tokenSaliences,
      categories,
    };
    return wikiData;
  };

  // p = partOfSpeech, t = text/token, c = count to save space in db
  private _getTokens = async (document: GoogleLangClientParams): Promise<string> => {
    const encodingType = 'UTF8';
    const [syntax] = await this._googleLangClient.analyzeSyntax({ document, encodingType });
    const tokens = syntax.tokens.map((token: any) => {
      const { partOfSpeech, text } = token;
      const { tag } = partOfSpeech;
      const { content } = text;
      const processedToken = {
        p: tag,
        t: content,
      };
      return processedToken;
    });
    return this._lzString.compress(JSON.stringify(tokens));
  };

  private _getTokenSaliences = async (tokens: StringKeyObject[]): Promise<string> => {
    const tokenSaliences: StringKeyObject[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.p == 'PUNCT') {
        continue;
      }
      const tokenSalience = tokenSaliences.find((tk) => {
        return tk.t == token.t;
      });
      if (!tokenSalience) {
        tokenSaliences.push({
          t: token.t,
          c: 1,
        });
      } else {
        tokenSalience.c++;
      }
    }
    return this._lzString.compress(JSON.stringify(tokenSaliences));
  };

  private _getCategories = async (langLinks: Link[]): Promise<any[]> => {
    const document = await this._getEnglishDocument(langLinks);
    if (document) {
      try {
        const [classification] = await this._googleLangClient.classifyText({ document });
        let { categories } = classification;
        categories = categories
          .filter((category: StringKeyObject) => {
            return category.confidence >= 0.5;
          })
          .map((category: StringKeyObject) => {
            const { name } = category;
            return name;
          });
        return categories;
      } catch (err) {
        return [];
      }
    } else {
      return [];
    }
  };

  private _getEnglishDocument = async (langLinks: Link[]) => {
    const enLink = langLinks.find((langLink) => {
      return langLink.lang == 'en';
    });
    if (enLink) {
      const enContent = await (await this._wiki().page(enLink!.title)).rawContent();
      const document = {
        content: enContent,
        type: 'PLAIN_TEXT',
      };
      return document;
    }
  };

  public init = async (initParams: {
    fs: any;
    xmlStream: any;
    wiki: typeof wiki;
    makeContentEntity: Promise<ContentEntity>;
    makeContentDbService: Promise<ContentDbService>;
    googleLangClient: any;
    lzString: any;
    bluebird: typeof bluebird;
    striptags: typeof striptags;
  }): Promise<this> => {
    const {
      fs,
      xmlStream,
      wiki,
      makeContentEntity,
      makeContentDbService,
      googleLangClient,
      lzString,
      bluebird,
      striptags,
    } = initParams;
    this._fs = fs;
    this._fsPromises = fs.promises;
    this._xmlStream = xmlStream;
    this._wiki = wiki;
    this._contentEntity = await makeContentEntity;
    this._contentDbService = await makeContentDbService;
    this._googleLangClient = googleLangClient;
    this._lzString = lzString;
    this._bluebird = bluebird;
    this._striptags = striptags;
    return this;
  };
}

export { WikipediaParser, WikipediaArticle };
