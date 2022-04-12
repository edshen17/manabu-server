import express from 'express';
import multer from 'multer';
import { makeCreateOcrContentsController } from '../../../../../components/controllers/content/createOcrContentsController';
import { makeJSONExpressCallback } from '../../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const upload = multer();

const ocr = express.Router();

ocr.post(
  '/',
  upload.array('uploadedImages'),
  makeJSONExpressCallback.consume(makeCreateOcrContentsController)
);

export { ocr };
