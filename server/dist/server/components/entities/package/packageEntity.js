"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_ENTITY_TYPE = exports.PACKAGE_ENTITY_NAME = exports.PackageEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
var PACKAGE_ENTITY_NAME;
(function (PACKAGE_ENTITY_NAME) {
    PACKAGE_ENTITY_NAME["TRIAL"] = "trial";
    PACKAGE_ENTITY_NAME["LIGHT"] = "light";
    PACKAGE_ENTITY_NAME["MODERATE"] = "moderate";
    PACKAGE_ENTITY_NAME["MAINICHI"] = "mainichi";
    PACKAGE_ENTITY_NAME["CUSTOM"] = "custom";
})(PACKAGE_ENTITY_NAME || (PACKAGE_ENTITY_NAME = {}));
exports.PACKAGE_ENTITY_NAME = PACKAGE_ENTITY_NAME;
var PACKAGE_ENTITY_TYPE;
(function (PACKAGE_ENTITY_TYPE) {
    PACKAGE_ENTITY_TYPE["DEFAULT"] = "default";
    PACKAGE_ENTITY_TYPE["CUSTOM"] = "custom";
})(PACKAGE_ENTITY_TYPE || (PACKAGE_ENTITY_TYPE = {}));
exports.PACKAGE_ENTITY_TYPE = PACKAGE_ENTITY_TYPE;
class PackageEntity extends AbstractEntity_1.AbstractEntity {
    _buildTemplate = (buildParams) => {
        const { lessonAmount, isOffering, type, lessonDurations, name, description, tags } = buildParams;
        const packageEntity = {
            lessonAmount,
            isOffering,
            description: description || '',
            tags: tags || [],
            type,
            name,
            lessonDurations,
            createdDate: new Date(),
            lastModifiedDate: new Date(),
        };
        return packageEntity;
    };
}
exports.PackageEntity = PackageEntity;
