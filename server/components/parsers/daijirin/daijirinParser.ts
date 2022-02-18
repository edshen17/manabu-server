import { JsonDbService } from '../../dataAccess/services/json/jsonDbService';

class DaijirinParser {
  private _fsPromises!: any;
  private _jsonDbService!: JsonDbService;

  public parse = async (): Promise<void> => {
    const fileNames: string[] = await this._fsPromises.readdir('../data/daijirin');
    for (const fileName of fileNames) {
      if (fileName.includes('term_bank')) {
        const bufferJson = await this._fsPromises.readFile(`../data/daijirin/${fileName}`);
        const json = JSON.parse(bufferJson);
      }
    }
  };

  public init = async (initParams: {
    fs: any;
    makeJsonDbService: Promise<JsonDbService>;
  }): Promise<this> => {
    const { fs, makeJsonDbService } = initParams;
    this._fsPromises = fs.promises;
    try {
      this._jsonDbService = await makeJsonDbService;
    } catch (err) {
      console.log(err);
    }
    return this;
  };
}

export { DaijirinParser };
