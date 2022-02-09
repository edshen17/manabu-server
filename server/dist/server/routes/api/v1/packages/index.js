"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packages = void 0;
const express_1 = __importDefault(require("express"));
const createPackagesController_1 = require("../../../../components/controllers/package/createPackagesController");
const deletePackageController_1 = require("../../../../components/controllers/package/deletePackageController");
const editPackageController_1 = require("../../../../components/controllers/package/editPackageController");
const expressCallback_1 = require("../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const packages = express_1.default.Router();
exports.packages = packages;
packages.patch('/:packageId', expressCallback_1.makeJSONExpressCallback.consume(editPackageController_1.makeEditPackageController));
packages.delete('/:packageId', expressCallback_1.makeJSONExpressCallback.consume(deletePackageController_1.makeDeletePackageController));
packages.post('/', expressCallback_1.makeJSONExpressCallback.consume(createPackagesController_1.makeCreatePackagesController));
