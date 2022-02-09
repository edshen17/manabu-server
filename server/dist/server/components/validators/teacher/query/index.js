"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTeacherQueryValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const teacherQueryValidator_1 = require("./teacherQueryValidator");
const makeTeacherQueryValidator = new teacherQueryValidator_1.TeacherQueryValidator().init({ joi: joi_1.joi });
exports.makeTeacherQueryValidator = makeTeacherQueryValidator;
