import express from 'express';
import { makeGetPackageTransactionController } from '../../../../components/controllers/packageTransaction/getPackageTransactionController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const packageTransactions = express.Router();

packageTransactions.get(
  '/:packageTransactionId',
  makeJSONExpressCallback.consume(makeGetPackageTransactionController)
);

export { packageTransactions };
