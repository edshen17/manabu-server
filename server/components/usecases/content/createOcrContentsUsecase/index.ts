import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { GCS_KEYFILE } from '../../../../constants';
import { makeStubDbService } from '../../../dataAccess/services/stub';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { CreateOcrContentsUsecase } from './createOcrContentsUsecase';
const vision = require('@google-cloud/vision');

const gcsKeyfile = JSON.parse(GCS_KEYFILE);
const { project_id, private_key, client_email } = gcsKeyfile;
const visionClient = new vision.ImageAnnotatorClient({
  projectId: project_id,
  credentials: {
    client_email,
    private_key,
  },
});

const makeCreateOcrContentsUsecase = new CreateOcrContentsUsecase().init({
  makeDbService: makeStubDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
  visionClient,
});

export { makeCreateOcrContentsUsecase };
