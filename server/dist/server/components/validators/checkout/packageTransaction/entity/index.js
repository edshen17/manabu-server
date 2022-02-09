"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageTransactionCheckoutEntityValidator = void 0;
const joi_1 = require("../../../../entities/utils/joi");
const packageTransactionCheckoutEntityValidator_1 = require("./packageTransactionCheckoutEntityValidator");
const makePackageTransactionCheckoutEntityValidator = new packageTransactionCheckoutEntityValidator_1.PackageTransactionCheckoutEntityValidator().init({ joi: joi_1.joi });
exports.makePackageTransactionCheckoutEntityValidator = makePackageTransactionCheckoutEntityValidator;
