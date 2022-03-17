import wiki from 'wikijs';
import { MANABU_ADMIN_ID } from '../../../constants';
import { StringKeyObject } from '../../../types/custom';
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

class WikipediaParser {
  private _fs!: any;
  private _fsPromises!: any;
  private _xmlStream!: any;
  private _wiki!: typeof wiki;
  private _contentEntity!: ContentEntity;

  public populateDb = async (): Promise<void> => {
    const dataPath = `${__dirname}/../data/wikipedia`;
    const fileNames: string[] = await this._fsPromises.readdir(dataPath);
    // for (const fileName of fileNames) {
    //   if (fileName.includes('1.xml')) {
    //     const stream = this._fs.createReadStream(`${dataPath}/${fileName}`);
    //     const xml = new this._xmlStream(stream);
    //     xml.on('endElement: page', (wikipediaArticle: WikipediaArticle) => {
    //       if (wikipediaArticle.ns == '0') {
    //         console.log(wikipediaArticle);
    //       }
    //       // const text = await (
    //       //   await wiki({ apiUrl: 'https://ja.wikipedia.org/w/api.php' }).page('哲学')
    //       // ).langlinks()
    //     });
    //   }
    // }
    await this._createContentEntity('哲学');
  };

  private _createContentEntity = async (title: string): Promise<StringKeyObject> => {
    const wiki = await this._wiki({
      apiUrl: 'https://ja.wikipedia.org/w/api.php',
    }).page(title);
    const rawContent = await wiki.rawContent();
    const coverImageUrl = await wiki.mainImage();
    const sourceUrl = wiki.url();
    const summary = await wiki.summary();
    const tokens = rawContent.split('は');
    const keyEntities = [{ word: 't', salience: 0.05 }];
    const categories = ['science'];
    const contentEntity = await this._contentEntity.build({
      postedById: MANABU_ADMIN_ID as any,
      title,
      coverImageUrl,
      sourceUrl,
      summary,
      keyEntities,
      tokens,
      categories,
      ownership: CONTENT_ENTITY_OWNERSHIP.PUBLIC,
      author: 'Wikipedia',
      type: CONTENT_ENTITY_TYPE.WIKIPEDIA,
    });
    console.log(contentEntity);
    return contentEntity;
  };

  public init = async (initParams: {
    fs: any;
    xmlStream: any;
    wiki: typeof wiki;
    makeContentEntity: Promise<ContentEntity>;
  }): Promise<this> => {
    const { fs, xmlStream, wiki, makeContentEntity } = initParams;
    this._fs = fs;
    this._fsPromises = fs.promises;
    this._xmlStream = xmlStream;
    this._wiki = wiki;
    this._contentEntity = await makeContentEntity;
    return this;
  };
}

export { WikipediaParser, WikipediaArticle };
