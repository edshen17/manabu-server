import {
  ContentEntityBuildParams,
  ContentEntityBuildResponse,
} from '../../../entities/content/contentEntity';
import { ContentDbServiceResponse } from '../../services/content/contentDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type OptionalFakeDbContentFactoryInitParams = {
  fs: any;
};

class FakeDbContentFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbContentFactoryInitParams,
  ContentEntityBuildParams,
  ContentEntityBuildResponse,
  ContentDbServiceResponse
> {
  private _fsPromises!: any;

  protected _createFakeBuildParams = async (): Promise<ContentEntityBuildParams> => {
    const bufferJson = await this._fsPromises.readFile(`${__dirname}/content.json`);
    const contentArr = JSON.parse(bufferJson);
    const { _id, createdDate, lastModifiedDate, __v, ...fakeBuildParams } = contentArr[30];
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbContentFactoryInitParams
  ): Promise<void> => {
    const { fs } = optionalInitParams;
    this._fsPromises = fs.promises;
  };
}

export { FakeDbContentFactory };
