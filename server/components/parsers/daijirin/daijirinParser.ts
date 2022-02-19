import { JsonDbService } from '../../dataAccess/services/json/jsonDbService';

class DaijirinParser {
  private _fsPromises!: any;
  private _jsonDbService!: JsonDbService;

  public populateDb = async (): Promise<void> => {
    const dataPath = `${__dirname}/../data/daijirin`;
    const fileNames: string[] = await this._fsPromises.readdir(dataPath);
    const promiseArr = [];
    for (const fileName of fileNames) {
      if (fileName.includes('term_bank')) {
        const bufferJson = await this._fsPromises.readFile(`${dataPath}/${fileName}`);
        const wordArrs = JSON.parse(bufferJson);
        for (const wordArr of wordArrs) {
          const word = wordArr[0];
          const kana = wordArr[1] ? wordArr[1] : wordArr[0];
          const definition = wordArr[5][0];
          const encodedAudioUrl = `https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=${encodeURIComponent(
            kana
          )}&kanji=${encodeURIComponent(word)}`;
          const modelToInsert = {
            word,
            kana,
            definition: this._formatDefinition(definition),
            audioLinks: [encodedAudioUrl],
            pitch: this._getPitch(definition),
          };
          promiseArr.push(
            this._jsonDbService.insert({
              modelName: 'ja-ja:word',
              modelToInsert,
            })
          );
        }
        console.log(fileName);
      }
    }
    await Promise.all(promiseArr);
  };

  private _formatDefinition = (definition: string): string => {
    const reg = /(\uFF08[\uFF10-\uFF19]+\uFF09)(?![^{]*})/g;
    return definition.replace(reg, '<br />$&');
  };

  private _getPitch = (definition: string): number[] => {
    const stringPitch = definition.match(/\[[0-9]+\]/g);
    const convertedPitch = stringPitch
      ? stringPitch
          .map((strPitch) => {
            return parseInt(strPitch.replace(/[/[\]']+/g, ''));
          })
          .sort((a, b) => {
            return a - b;
          })
      : [];
    return convertedPitch;
  };

  public init = async (initParams: {
    fs: any;
    makeJsonDbService: Promise<JsonDbService>;
  }): Promise<this> => {
    const { fs, makeJsonDbService } = initParams;
    this._fsPromises = fs.promises;
    this._jsonDbService = await makeJsonDbService;
    return this;
  };
}

export { DaijirinParser };
