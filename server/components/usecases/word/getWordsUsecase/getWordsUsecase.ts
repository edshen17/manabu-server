import wanakana from 'wanakana';
import { StringKeyObject } from '../../../../types/custom';
import { JsonDbService } from '../../../dataAccess/services/json/jsonDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetWordsUsecaseInitParams = {
  makeJsonDbService: Promise<JsonDbService>;
  wanakana: typeof wanakana;
};

type GetWordsUsecaseResponse = { words: StringKeyObject[] };

class GetWordsUsecase extends AbstractGetUsecase<
  OptionalGetWordsUsecaseInitParams,
  GetWordsUsecaseResponse,
  undefined
> {
  private _jsonDbService!: JsonDbService;
  private _wanakana!: typeof wanakana;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetWordsUsecaseResponse> => {
    const { params, query } = props;
    const { word } = params;
    const { wordLanguage, definitionLanguage, page, limit } = query;
    const hiragana = this._wanakana.toHiragana(word);
    const katakana = this._wanakana.toKatakana(word);
    const { documents } = await this._jsonDbService.search({
      modelName: `${wordLanguage}-${definitionLanguage}:word`,
      searchQuery: `@word|kana:(${word} | ${hiragana} | ${katakana})`,
      options: {
        LIMIT: {
          from: parseInt(page) || 0,
          size: parseInt(limit) || 25,
        },
      },
    });
    const words = documents.map((doc: StringKeyObject) => {
      return doc.value;
    });
    return { words };
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalGetWordsUsecaseInitParams
  ): Promise<void> => {
    const { makeJsonDbService, wanakana } = optionalInitParams;
    this._jsonDbService = await makeJsonDbService;
    this._wanakana = wanakana;
  };
}

export { GetWordsUsecase, GetWordsUsecaseResponse };
