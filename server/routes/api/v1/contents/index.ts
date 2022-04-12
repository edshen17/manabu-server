import express from 'express';
import { makeGetContentController } from '../../../../components/controllers/content/getContentController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
import { ocr } from './ocr';

const contents = express.Router();

contents.get('/:contentId', makeJSONExpressCallback.consume(makeGetContentController));
contents.get('/:contentId', makeJSONExpressCallback.consume(makeGetContentController));
contents.use('/ocr', ocr);

export { contents };
