"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageParamsValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const packageParamsValidator_1 = require("./packageParamsValidator");
const makePackageParamsValidator = new packageParamsValidator_1.PackageParamsValidator().init({ joi: joi_1.joi });
exports.makePackageParamsValidator = makePackageParamsValidator;
