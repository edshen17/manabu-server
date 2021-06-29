import { PackageDoc } from '../../../../models/Package';
import { PackageEntityBuildResponse } from '../../../entities/package/packageEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type FakeDbPackageFactoryInitParams = {};
type FakeDbPackageEntityBuildParams = {
  hostedBy: any;
  lessonAmount?: number;
  packageType?: string;
};
class FakeDbPackageFactory extends AbstractFakeDbDataFactory<
  FakeDbPackageFactoryInitParams,
  FakeDbPackageEntityBuildParams,
  PackageEntityBuildResponse,
  PackageDoc
> {
  public createFakePackages = async (fakeEntityBuildParams: FakeDbPackageEntityBuildParams) => {
    const fakePackages = await this._createFakePackages(fakeEntityBuildParams);
    const dbServiceAccessOptions = this.getDbServiceAccessOptions();
    const fakeInsertedPackages = await this._dbService.insertMany({
      modelToInsert: fakePackages,
      dbServiceAccessOptions,
    });
    return fakeInsertedPackages;
  };

  private _createFakePackages = async (fakeEntityBuildParams: FakeDbPackageEntityBuildParams) => {
    const { hostedBy } = fakeEntityBuildParams;
    const lightPackage = await this._createFakeEntity({
      hostedBy,
      lessonAmount: 5,
      packageType: 'light',
    });
    const moderatePackage = await this._createFakeEntity({
      hostedBy,
      lessonAmount: 12,
      packageType: 'moderate',
    });
    const mainichiPackage = await this._createFakeEntity({
      hostedBy,
      lessonAmount: 22,
      packageType: 'mainichi',
    });
    return [lightPackage, moderatePackage, mainichiPackage];
  };
}

export { FakeDbPackageFactory };
