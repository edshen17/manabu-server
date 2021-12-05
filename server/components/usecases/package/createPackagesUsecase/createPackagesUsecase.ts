import { ObjectId } from 'mongoose';
import { PackageDoc } from '../../../../models/Package';
import { TeacherDoc } from '../../../../models/Teacher';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import {
  PackageEntity,
  PackageEntityBuildParams,
  PackageEntityBuildResponse,
} from '../../../entities/package/packageEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreatePackagesUsecaseInitParams = {
  makePackageEntity: Promise<PackageEntity>;
};

type CreatePackagesUsecaseResponse = {
  packages: PackageDoc[];
};

class CreatePackagesUsecase extends AbstractCreateUsecase<
  OptionalCreatePackagesUsecaseInitParams,
  CreatePackagesUsecaseResponse,
  TeacherDbServiceResponse
> {
  private _packageEntity!: PackageEntity;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreatePackagesUsecaseResponse> => {
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

  private _createPackages = async (props: {
    packages: PackageEntityBuildParams[];
    dbServiceAccessOptions: DbServiceAccessOptions;
    teacherId: ObjectId | string;
  }): Promise<PackageDoc[]> => {
    const { packages, dbServiceAccessOptions, teacherId } = props;
    const modelToInsert: PackageEntityBuildResponse[] = [];
    for (const pkg of packages) {
      await this._createPackage({ pkg, modelToInsert });
    }
    const updatedDbTeacher = <TeacherDoc>await this._dbService.findOneAndUpdate({
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

  private _createPackage = async (props: {
    pkg: PackageEntityBuildParams;
    modelToInsert: PackageEntityBuildResponse[];
  }): Promise<void> => {
    const { pkg, modelToInsert } = props;
    const packageEntity = await this._packageEntity.build(pkg);
    modelToInsert.push(packageEntity);
  };

  private _getCreatedPackages = (props: {
    updatedDbPackages: PackageDoc[];
    modelToInsert: PackageEntityBuildResponse[];
  }): PackageDoc[] => {
    const { updatedDbPackages, modelToInsert } = props;
    const createdPackages = updatedDbPackages.filter((updatedDbPackage) => {
      return modelToInsert.some((bodyPackage) => {
        return bodyPackage.name == updatedDbPackage.name;
      });
    });
    return createdPackages;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreatePackagesUsecaseInitParams
  ): Promise<void> => {
    const { makePackageEntity } = optionalInitParams;
    this._packageEntity = await makePackageEntity;
  };
}

export { CreatePackagesUsecase, CreatePackagesUsecaseResponse };
