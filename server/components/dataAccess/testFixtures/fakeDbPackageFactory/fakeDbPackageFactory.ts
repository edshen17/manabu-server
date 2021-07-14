import { PackageDoc } from '../../../../models/Package';
import {
  PackageEntityBuildParams,
  PackageEntityBuildResponse,
} from '../../../entities/package/packageEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type PartialFakeDbPackageFactoryInitParams = {};

class FakeDbPackageFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbPackageFactoryInitParams,
  PackageEntityBuildParams,
  PackageEntityBuildResponse,
  PackageDoc
> {
  protected _createFakeBuildParams = async (): Promise<PackageEntityBuildParams> => {
    const fakeBuildParams = {
      hostedById: '605bc5ad9db900001528f77c',
      lessonAmount: 5,
      packageType: 'default',
      packageName: 'light',
      isOffering: true,
      lessonDurations: [30, 60],
    };
    return fakeBuildParams;
  };

  public createFakePackages = async (buildParams: { hostedById: string }) => {
    const fakePackages = await this._createFakePackages(buildParams);
    const dbServiceAccessOptions = this.getDbServiceAccessOptions();
    const fakeInsertedPackages = await this._dbService.insertMany({
      modelToInsert: fakePackages,
      dbServiceAccessOptions,
    });
    return fakeInsertedPackages;
  };

  private _createFakePackages = async (buildParams: { hostedById: string }) => {
    const { hostedById } = buildParams;
    const lightPackage = await this._entity.build({
      hostedById: hostedById,
      lessonAmount: 5,
      packageType: 'default',
      packageName: 'light',
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const moderatePackage = await this._entity.build({
      hostedById,
      lessonAmount: 12,
      packageType: 'default',
      packageName: 'moderate',
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const mainichiPackage = await this._entity.build({
      hostedById,
      lessonAmount: 22,
      packageType: 'default',
      packageName: 'mainichi',
      isOffering: true,
      lessonDurations: [30, 60],
    });
    return [lightPackage, moderatePackage, mainichiPackage];
  };
}

export { FakeDbPackageFactory };
