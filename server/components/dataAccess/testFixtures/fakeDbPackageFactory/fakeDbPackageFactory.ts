import {
  PackageEntityBuildParams,
  PackageEntityBuildResponse,
  PACKAGE_ENTITY_NAME,
  PACKAGE_ENTITY_TYPE,
} from '../../../entities/package/packageEntity';
import { PackageDbServiceResponse } from '../../services/package/packageDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type PartialFakeDbPackageFactoryInitParams = {};

class FakeDbPackageFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbPackageFactoryInitParams,
  PackageEntityBuildParams,
  PackageEntityBuildResponse,
  PackageDbServiceResponse
> {
  protected _createFakeBuildParams = async (): Promise<PackageEntityBuildParams> => {
    const fakeBuildParams = {
      lessonAmount: 5,
      type: PACKAGE_ENTITY_TYPE.DEFAULT,
      name: PACKAGE_ENTITY_NAME.LIGHT,
      isOffering: true,
      lessonDurations: [30, 60],
    };
    return fakeBuildParams;
  };

  public createFakePackages = async () => {
    const fakePackages = this._createFakePackages();
    return fakePackages;
  };

  private _createFakePackages = () => {
    const lightPackage = this._entity.build({
      lessonAmount: 5,
      type: PACKAGE_ENTITY_TYPE.DEFAULT,
      name: PACKAGE_ENTITY_NAME.LIGHT,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const moderatePackage = this._entity.build({
      lessonAmount: 12,
      type: PACKAGE_ENTITY_TYPE.DEFAULT,
      name: PACKAGE_ENTITY_NAME.MODERATE,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const mainichiPackage = this._entity.build({
      lessonAmount: 22,
      type: PACKAGE_ENTITY_TYPE.DEFAULT,
      name: PACKAGE_ENTITY_NAME.MAINICHI,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const customPackage = this._entity.build({
      lessonAmount: 6,
      type: PACKAGE_ENTITY_TYPE.CUSTOM,
      name: 'custom package name',
      isOffering: true,
      lessonDurations: [30, 60, 90],
    });
    return [lightPackage, moderatePackage, mainichiPackage, customPackage];
  };
}

export { FakeDbPackageFactory };
