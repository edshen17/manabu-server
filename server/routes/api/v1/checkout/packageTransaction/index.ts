import express from 'express';
import { makeCreatePackageTransactionCheckoutController } from '../../../../../components/controllers/checkout/packageTransaction/createPackageTransactionCheckoutController';
import { makeJSONExpressCallback } from '../../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
const packageTransaction = express.Router();

packageTransaction.get(
  '/',
  makeJSONExpressCallback.consume(makeCreatePackageTransactionCheckoutController)
);
export { packageTransaction };
