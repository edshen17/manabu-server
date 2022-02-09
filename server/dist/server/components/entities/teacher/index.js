"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTeacherEntity = void 0;
const entity_1 = require("../../validators/teacher/entity");
const package_1 = require("../package");
const teacherEntity_1 = require("./teacherEntity");
const makeTeacherEntity = new teacherEntity_1.TeacherEntity().init({
    makeEntityValidator: entity_1.makeTeacherEntityValidator,
    makePackageEntity: package_1.makePackageEntity,
});
exports.makeTeacherEntity = makeTeacherEntity;
