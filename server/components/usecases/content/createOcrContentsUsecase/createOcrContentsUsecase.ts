import { StringKeyObject } from '../../../../types/custom';
import { StubDbServiceResponse } from '../../../dataAccess/services/stub/stubDbService';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreateOcrContentsUsecaseInitParams = {
  visionClient: any;
};

type CreateOcrContentsUsecaseResponse = any;

class CreateOcrContentsUsecase extends AbstractCreateUsecase<
  OptionalCreateOcrContentsUsecaseInitParams,
  CreateOcrContentsUsecaseResponse,
  StubDbServiceResponse
> {
  private _visionClient!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateOcrContentsUsecaseResponse> => {
    const { req } = props;
    const { files } = req;
    const createOcrContentsUsecaseRes = await this._createOcrContents(files);
    return createOcrContentsUsecaseRes;
  };
  private _createOcrContents = async (
    files: StringKeyObject[]
  ): Promise<CreateOcrContentsUsecaseResponse> => {
    const promises = [];
    for (const file of files) {
      const request = {
        image: {
          content: file.buffer,
        },
        imageContext: {
          languageHints: ['ja'],
        },
      };
      const promise = this._visionClient.textDetection(request);
      promises.push(promise);
    }
    const results = await Promise.all(promises);
    console.log(results[0][0]);
    // const annotations = result.textAnnotations.map((annotation: StringKeyObject) => {
    //   return annotation.description;
    // });
    return [];
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateOcrContentsUsecaseInitParams
  ): Promise<void> => {
    const { visionClient } = optionalInitParams;
    this._visionClient = visionClient;
  };
}

export { CreateOcrContentsUsecase, CreateOcrContentsUsecaseResponse };
