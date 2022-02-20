import express from 'express';
import { makeGetWordsController } from '../../../../components/controllers/word/getWordsController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const words = express.Router();

words.get('/:word', makeJSONExpressCallback.consume(makeGetWordsController));

export { words };
