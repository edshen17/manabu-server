import express from 'express';
import { makeGetPackageTransactionController } from '../../../../components/controllers/packageTransaction/getPackageTransactionController';
import { makeGetPackageTransactionsController } from '../../../../components/controllers/packageTransaction/getPackageTransactionsController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const packageTransactions = express.Router();

packageTransactions.get(
  '/self',
  makeJSONExpressCallback.consume(makeGetPackageTransactionsController)
);

packageTransactions.get(
  '/:packageTransactionId',
  makeJSONExpressCallback.consume(makeGetPackageTransactionController)
);

export { packageTransactions };
