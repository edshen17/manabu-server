import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalPackageEntityInitParams = {};

type PackageEntityBuildParams = {
  lessonAmount: number;
  description?: string;
  tags?: string[];
  isOffering: boolean;
  type: string;
  lessonDurations: number[];
  name: string;
};

type PackageEntityBuildResponse = {
  lessonAmount: number;
  isOffering: boolean;
  type: string;
  name: string;
  description?: string;
  tags?: string[];
  lessonDurations: number[];
  createdDate: Date;
  lastModifiedDate: Date;
};

enum PACKAGE_ENTITY_NAME {
  LIGHT = 'light',
  MODERATE = 'moderate',
  MAINICHI = 'mainichi',
  CUSTOM = 'custom',
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
    const { lessonAmount, isOffering, type, lessonDurations, name, description, tags } =
      buildParams;
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

export {
  PackageEntity,
  PackageEntityBuildResponse,
  PackageEntityBuildParams,
  PACKAGE_ENTITY_NAME,
  PACKAGE_ENTITY_TYPE,
};
