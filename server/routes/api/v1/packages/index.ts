import express from 'express';
import { makeCreatePackagesController } from '../../../../components/controllers/package/createPackagesController';
import { makeDeletePackageController } from '../../../../components/controllers/package/deletePackageController';
import { makeEditPackageController } from '../../../../components/controllers/package/editPackageController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const packages = express.Router();

packages.patch('/:packageId', makeJSONExpressCallback.consume(makeEditPackageController));

packages.delete('/:packageId', makeJSONExpressCallback.consume(makeDeletePackageController));

packages.post('/', makeJSONExpressCallback.consume(makeCreatePackagesController));

export { packages };
