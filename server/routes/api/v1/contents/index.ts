import express from 'express';
import { makeGetContentController } from '../../../../components/controllers/content/getContentController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const contents = express.Router();

contents.get('/:contentId', makeJSONExpressCallback.consume(makeGetContentController));

export { contents };
