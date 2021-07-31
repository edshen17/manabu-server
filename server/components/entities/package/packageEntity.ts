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
  lessonDurations: number[];
  lastUpdated: Date;
};

enum PACKAGE_ENTITY_NAME {
  LIGHT = 'Light Plan',
  MODERATE = 'Moderate Plan',
  MAINICHI = 'Mainichi Plan',
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
    const packageEntity = Object.freeze({
      lessonAmount,
      isOffering,
      packageType,
      packageName,
      lessonDurations,
      lastUpdated: new Date(),
    });
    return packageEntity;
  };
}

export { PackageEntity, PackageEntityBuildResponse, PackageEntityBuildParams, PACKAGE_ENTITY_NAME };
