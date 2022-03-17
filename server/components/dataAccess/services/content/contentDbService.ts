import { ContentDoc } from '../../../../models/Content';
import { AbstractDbService } from '../../abstractions/AbstractDbService';

type OptionalContentDbServiceInitParams = {};

type ContentDbServiceResponse = ContentDoc;

class ContentDbService extends AbstractDbService<
  OptionalContentDbServiceInitParams,
  ContentDbServiceResponse
> {
  protected _getDbServiceModelViews = () => {
    return {
      defaultView: {
        titleNGrams: 0,
      },
      adminView: {
        titleNGrams: 0,
      },
      selfView: {
        titleNGrams: 0,
      },
      overrideView: {},
    };
  };
}

export { ContentDbService, ContentDbServiceResponse };
