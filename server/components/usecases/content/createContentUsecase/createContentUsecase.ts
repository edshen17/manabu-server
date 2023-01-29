import { ObjectId } from 'mongoose';
import { ContentDoc } from '../../../../models/Content';
import {
  ContentDbService,
  ContentDbServiceResponse,
} from '../../../dataAccess/services/content/contentDbService';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
import { ContentEntity } from '../../../entities/content/contentEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreateContentUsecaseInitParams = {
  makeContentDbService: Promise<ContentDbService>;
  makeContentEntity: Promise<ContentEntity>;
  makeGraphDbService: Promise<GraphDbService>;
};

type CreateContentUsecaseResponse = {
  content: ContentDoc;
};

class CreateContentUsecase extends AbstractCreateUsecase<
  OptionalCreateContentUsecaseInitParams,
  CreateContentUsecaseResponse,
  ContentDbServiceResponse
> {
  private _contentEntity!: ContentEntity;
  private _contentDbService!: ContentDbService;
  private _graphDbService!: GraphDbService;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateContentUsecaseResponse> => {
    const { body, dbServiceAccessOptions, currentAPIUser } = props;
    const contentEntity = await this._contentEntity.build({
      ...body,
      hostedById: <ObjectId>currentAPIUser.userId,
    });
    const content = await this._contentDbService.insert({
      modelToInsert: contentEntity,
      dbServiceAccessOptions,
    });
    // it('should create content', async () => {
    //   const url =
    //     'https://www.nationalgeographic.com/history/article/how-the-first-earth-day-ushered-in-a-golden-age-of-activism';
    //   const { data } = await axios.get(url);
    //   const sanitizedHtml = sanitizeHtml(data, {
    //     allowedTags: sanitizeHtml.defaults.allowedTags.concat(['head', 'meta']),
    //     allowedAttributes: {
    //       ...sanitizeHtml.defaults.allowedAttributes,
    //       meta: ['property', 'content'],
    //     },
    //   });
    //   const { window } = new JSDOM(sanitizedHtml, {
    //     url,
    //   });
    //   const { document } = window;
    //   const reader = new Readability(document);
    //   const article = reader.parse();
    //   console.log(document.querySelector("meta[property='og:image']")?.getAttribute('content'));
    // });
    const usecaseRes = {
      content,
    };
    return usecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateContentUsecaseInitParams
  ): Promise<void> => {
    const { makeContentDbService, makeContentEntity, makeGraphDbService } = optionalInitParams;
    this._contentDbService = await makeContentDbService;
    this._contentEntity = await makeContentEntity;
    this._graphDbService = await makeGraphDbService;
  };
}

export { CreateContentUsecase, CreateContentUsecaseResponse };
