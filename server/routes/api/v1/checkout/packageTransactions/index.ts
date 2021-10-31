import express from 'express';
import { makeCreatePackageTransactionCheckoutController } from '../../../../../components/controllers/checkout/packageTransaction/createPackageTransactionCheckoutController';
import { makeJSONExpressCallback } from '../../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const packageTransactions = express.Router();

packageTransactions.get(
  '/',
  makeJSONExpressCallback.consume(makeCreatePackageTransactionCheckoutController)
);
export { packageTransactions };
