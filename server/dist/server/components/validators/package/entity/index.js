"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageEntityValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const packageEntityValidator_1 = require("./packageEntityValidator");
const makePackageEntityValidator = new packageEntityValidator_1.PackageEntityValidator().init({ joi: joi_1.joi });
exports.makePackageEntityValidator = makePackageEntityValidator;
