"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePackagesUsecase = void 0;
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
class CreatePackagesUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _packageEntity;
    _makeRequestTemplate = async (props) => {
        const { body, dbServiceAccessOptions, currentAPIUser } = props;
        const { packages } = body;
        const { teacherId } = currentAPIUser;
        if (!teacherId) {
            throw new Error('You must be a teacher to create packages.');
        }
        const savedDbPackages = await this._createPackages({
            packages,
            dbServiceAccessOptions,
            teacherId,
        });
        const usecaseRes = {
            packages: savedDbPackages,
        };
        return usecaseRes;
    };
    _createPackages = async (props) => {
        const { packages, dbServiceAccessOptions, teacherId } = props;
        const modelToInsert = [];
        for (const pkg of packages) {
            await this._createPackage({ pkg, modelToInsert });
        }
        const updatedDbTeacher = await this._dbService.findOneAndUpdate({
            searchQuery: { _id: teacherId },
            dbServiceAccessOptions,
            updateQuery: {
                $addToSet: { packages: { $each: modelToInsert } },
            },
            queryOptions: { upsert: true },
        });
        const updatedDbPackages = updatedDbTeacher.packages;
        const createdPackages = this._getCreatedPackages({ updatedDbPackages, modelToInsert });
        return createdPackages;
    };
    _createPackage = async (props) => {
        const { pkg, modelToInsert } = props;
        const packageEntity = await this._packageEntity.build(pkg);
        modelToInsert.push(packageEntity);
    };
    _getCreatedPackages = (props) => {
        const { updatedDbPackages, modelToInsert } = props;
        const createdPackages = updatedDbPackages.filter((updatedDbPackage) => {
            return modelToInsert.some((bodyPackage) => {
                return bodyPackage.name == updatedDbPackage.name;
            });
        });
        return createdPackages;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makePackageEntity } = optionalInitParams;
        this._packageEntity = await makePackageEntity;
    };
}
exports.CreatePackagesUsecase = CreatePackagesUsecase;
