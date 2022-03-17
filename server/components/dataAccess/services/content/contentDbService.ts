import { ContentDoc } from '../../../../models/Content';
import { AbstractDbService } from '../../abstractions/AbstractDbService';

type OptionalContentDbServiceInitParams = {};

type ContentDbServiceResponse = ContentDoc;

class ContentDbService extends AbstractDbService<
  OptionalContentDbServiceInitParams,
  ContentDbServiceResponse
> {}

export { ContentDbService, ContentDbServiceResponse };
