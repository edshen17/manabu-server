import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalPackageEntityInitParams = {};

type PackageEntityBuildParams = {
  lessonAmount: number;
  isOffering: boolean;
  packageType: string;
  lessonDurations: number[];
  packageName: string;
};

type PackageEntityBuildResponse = {
  lessonAmount: number;
  isOffering: boolean;
  packageType: string;
  packageName: string;
  lessonDurations: number[];
  createdDate: Date;
  lastModifiedDate: Date;
};

enum PACKAGE_ENTITY_NAME {
  LIGHT = 'light plan',
  MODERATE = 'moderate plan',
  MAINICHI = 'mainichi plan',
  CUSTOM = 'custom plan',
}

enum PACKAGE_ENTITY_TYPE {
  DEFAULT = 'default',
  CUSTOM = 'custom',
}

class PackageEntity extends AbstractEntity<
  OptionalPackageEntityInitParams,
  PackageEntityBuildParams,
  PackageEntityBuildResponse
> {
  protected _buildTemplate = (
    buildParams: PackageEntityBuildParams
  ): PackageEntityBuildResponse => {
    const { lessonAmount, isOffering, packageType, lessonDurations, packageName } = buildParams;
    const packageEntity = {
      lessonAmount,
      isOffering,
      packageType,
      packageName,
      lessonDurations,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    };
    return packageEntity;
  };
}

export {
  PackageEntity,
  PackageEntityBuildResponse,
  PackageEntityBuildParams,
  PACKAGE_ENTITY_NAME,
  PACKAGE_ENTITY_TYPE,
};
