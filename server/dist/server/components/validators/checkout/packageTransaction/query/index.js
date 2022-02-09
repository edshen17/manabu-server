"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageTransactionCheckoutQueryValidator = void 0;
const joi_1 = require("../../../../entities/utils/joi");
const packageTransactionCheckoutQueryValidator_1 = require("./packageTransactionCheckoutQueryValidator");
const makePackageTransactionCheckoutQueryValidator = new packageTransactionCheckoutQueryValidator_1.PackageTransactionCheckoutQueryValidator().init({ joi: joi_1.joi });
exports.makePackageTransactionCheckoutQueryValidator = makePackageTransactionCheckoutQueryValidator;
