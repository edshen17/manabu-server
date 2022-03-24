import { ObjectId } from 'mongoose';
import { ContentDoc } from '../../../../models/Content';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { ContentDbServiceResponse } from '../../../dataAccess/services/content/contentDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetContentUsecaseInitParams = {};

type GetContentUsecaseResponse = { content: ContentDoc };

class GetContentUsecase extends AbstractGetUsecase<
  OptionalGetContentUsecaseInitParams,
  GetContentUsecaseResponse,
  ContentDbServiceResponse
> {
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetContentUsecaseResponse> => {
    const { params, dbServiceAccessOptions } = props;
    const { contentId } = params;
    const content = await this._getContent({
      contentId,
      dbServiceAccessOptions,
    });
    if (!content) {
      throw new Error('Content not found.');
    }
    return { content };
  };

  private _getContent = async (props: {
    contentId: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<ContentDoc> => {
    const { contentId, dbServiceAccessOptions } = props;
    const content = await this._dbService.findById({
      _id: contentId,
      dbServiceAccessOptions,
    });
    return content;
  };
}

export { GetContentUsecase, GetContentUsecaseResponse };
