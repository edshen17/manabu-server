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

type WikipediaArticle = {
  title: string;
  ns: string;
  id: string;
  revision: {
    id: string;
    parentId: string;
    timestamp: string;
    constributor: { username: string; id: string };
    model: string;
    format: string;
    text: {
      $: StringKeyObject;
      $text: string;
    };
    sha1: string;
  };
};

type GoogleLangClientParams = { content: string; type: string };

class WikipediaParser {
  private _fs!: any;
  private _fsPromises!: any;
  private _xmlStream!: any;
  private _wiki!: typeof wiki;
  private _contentEntity!: ContentEntity;
  private _contentDbService!: ContentDbService;
  private _googleLangClient!: any;

  public populateDb = async (): Promise<void> => {
    const dataPath = `${__dirname}/../data/wikipedia`;
    const fileNames: string[] = await this._fsPromises.readdir(dataPath);
    // for (const fileName of fileNames) {
    //   if (fileName.includes('1.xml')) {
    //     const stream = this._fs.createReadStream(`${dataPath}/${fileName}`);
    //     const xml = new this._xmlStream(stream);
    //     xml.on('endElement: page', async (wikipediaArticle: WikipediaArticle) => {
    //       if (wikipediaArticle.ns == '0') {
    //         const { title } = wikipediaArticle;
    //         await this._createContent(title);
    //       }
    //     });
    //   }
    // }
    await this._createContent('哲学');
  };

  private _createContent = async (title: string): Promise<ContentDoc> => {
    const { coverImageUrl, sourceUrl, summary, entities, tokens, categories, rawContent } =
      await this._getWikiArticleData(title);
    const contentEntity = await this._contentEntity.build({
      postedById: MANABU_ADMIN_ID as any,
      title,
      coverImageUrl,
      sourceUrl,
      rawContent,
      summary,
      entities,
      tokens,
      categories,
      ownership: CONTENT_ENTITY_OWNERSHIP.PUBLIC,
      author: 'Wikipedia',
      type: CONTENT_ENTITY_TYPE.WIKIPEDIA,
    });

    const dbServiceAccessOptions = this._contentDbService.getBaseDbServiceAccessOptions();
    const savedDbContent = await this._contentDbService.insert({
      modelToInsert: contentEntity,
      dbServiceAccessOptions,
    });
    return savedDbContent;
  };

  private _getWikiArticleData = async (title: string) => {
    const wiki = await this._wiki({
      apiUrl: 'https://ja.wikipedia.org/w/api.php',
    }).page(title);
    const rawContent = await wiki.rawContent();
    const coverImageUrl = await wiki.mainImage();
    const sourceUrl = wiki.url();
    const summary = await wiki.summary();
    const langLinks = await wiki.langlinks();
    const document = {
      content: rawContent,
      type: 'PLAIN_TEXT',
    };
    const tokens = await this._getTokens(document);
    const entities = await this._getEntities(document);
    const categories = await this._getCategories(langLinks);
    const wikiData = {
      coverImageUrl,
      sourceUrl,
      summary,
      tokens,
      rawContent,
      entities,
      categories,
    };
    return wikiData;
  };

  private _getTokens = async (document: GoogleLangClientParams): Promise<string[]> => {
    const encodingType = 'UTF8';
    const [syntax] = await this._googleLangClient.analyzeSyntax({ document, encodingType });
    const tokens = syntax.tokens.map((token: StringKeyObject) => {
      return token.text.content;
    });
    return tokens;
  };

  private _getEntities = async (document: GoogleLangClientParams): Promise<StringKeyObject[]> => {
    const [result] = await this._googleLangClient.analyzeEntities({ document });
    const entities = result.entities.map((entity: StringKeyObject) => {
      const { name, salience } = entity;
      return {
        word: name,
        salience,
      };
    });
    return entities;
  };

  private _getCategories = async (langLinks: Link[]): Promise<string[]> => {
    const document = await this._getEnglishDocument(langLinks);
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
  };

  private _getEnglishDocument = async (langLinks: Link[]) => {
    const enLink = langLinks.find((langLink) => {
      return langLink.lang == 'en';
    });
    const enContent = await (await wiki().page(enLink!.title)).rawContent();
    const document = {
      content: enContent,
      type: 'PLAIN_TEXT',
    };
    return document;
  };

  public init = async (initParams: {
    fs: any;
    xmlStream: any;
    wiki: typeof wiki;
    makeContentEntity: Promise<ContentEntity>;
    makeContentDbService: Promise<ContentDbService>;
    googleLangClient: any;
  }): Promise<this> => {
    const { fs, xmlStream, wiki, makeContentEntity, makeContentDbService, googleLangClient } =
      initParams;
    this._fs = fs;
    this._fsPromises = fs.promises;
    this._xmlStream = xmlStream;
    this._wiki = wiki;
    this._contentEntity = await makeContentEntity;
    this._contentDbService = await makeContentDbService;
    this._googleLangClient = googleLangClient;
    return this;
  };
}

export { WikipediaParser, WikipediaArticle };
