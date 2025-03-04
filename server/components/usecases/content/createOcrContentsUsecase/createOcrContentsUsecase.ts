import { StringKeyObject } from '../../../../types/custom';
import { StubDbServiceResponse } from '../../../dataAccess/services/stub/stubDbService';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreateOcrContentsUsecaseInitParams = {
  visionClient: any;
};

type CreateOcrContentsUsecaseResponse = {
  ocrContents: StringKeyObject[];
};

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
    const { ocrContents } = await this._createOcrContents(files);
    return { ocrContents };
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
      };
      const promise = this._visionClient.textDetection(request);
      promises.push(promise);
    }
    const annotatedBatch = await Promise.all(promises);
    const ocrContents = annotatedBatch.map((results: StringKeyObject[]) => {
      return results.map((result) => {
        return result.textAnnotations;
      });
    });
    return { ocrContents };
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateOcrContentsUsecaseInitParams
  ): Promise<void> => {
    const { visionClient } = optionalInitParams;
    this._visionClient = visionClient;
  };
}

export { CreateOcrContentsUsecase, CreateOcrContentsUsecaseResponse };
