"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageEntity = void 0;
const entity_1 = require("../../validators/package/entity");
const packageEntity_1 = require("./packageEntity");
const makePackageEntity = new packageEntity_1.PackageEntity().init({
    makeEntityValidator: entity_1.makePackageEntityValidator,
});
exports.makePackageEntity = makePackageEntity;
