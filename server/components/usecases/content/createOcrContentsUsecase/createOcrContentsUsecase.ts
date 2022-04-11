import { StringKeyObject } from '../../../../types/custom';
import { StubDbServiceResponse } from '../../../dataAccess/services/stub/stubDbService';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreateOcrContentsUsecaseInitParams = {
  visionClient: any;
  joi: any;
};

type CreateOcrContentsUsecaseResponse = any;

class CreateOcrContentsUsecase extends AbstractCreateUsecase<
  OptionalCreateOcrContentsUsecaseInitParams,
  CreateOcrContentsUsecaseResponse,
  StubDbServiceResponse
> {
  private _visionClient!: any;
  private _joi: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateOcrContentsUsecaseResponse> => {
    const { body } = props;
    const { files } = await this._testBody(body);
    const createOcrContentsUsecaseRes = await this._createOcrContents(files);
    return createOcrContentsUsecaseRes;
  };

  private _testBody = async (body: StringKeyObject): Promise<StringKeyObject> => {
    console.log(body);
    const schema = this._joi.object({
      files: this._joi.array(),
    });
    const { value } = schema.validate(body);
    return value;
  };

  private _createOcrContents = async (
    files: StringKeyObject[]
  ): Promise<CreateOcrContentsUsecaseResponse> => {
    const promises = [];
    console.log(files);
    // const fileName = `${__dirname}/test.png`;
    // const [result] = await this._visionClient.textDetection(fileName);
    // const detections = result.textAnnotations;
    // console.log(detections[0]);
    return [];
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateOcrContentsUsecaseInitParams
  ): Promise<void> => {
    const { visionClient, joi } = optionalInitParams;
    this._visionClient = visionClient;
    this._joi = joi;
  };
}

export { CreateOcrContentsUsecase, CreateOcrContentsUsecaseResponse };
