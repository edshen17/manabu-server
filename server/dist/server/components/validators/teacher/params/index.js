"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTeacherParamsValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const teacherParamsValidator_1 = require("./teacherParamsValidator");
const makeTeacherParamsValidator = new teacherParamsValidator_1.TeacherParamsValidator().init({ joi: joi_1.joi });
exports.makeTeacherParamsValidator = makeTeacherParamsValidator;
