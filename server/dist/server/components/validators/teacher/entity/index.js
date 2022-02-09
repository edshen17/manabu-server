"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTeacherEntityValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const teacherEntityValidator_1 = require("./teacherEntityValidator");
const makeTeacherEntityValidator = new teacherEntityValidator_1.TeacherEntityValidator().init({ joi: joi_1.joi });
exports.makeTeacherEntityValidator = makeTeacherEntityValidator;
