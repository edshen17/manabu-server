import { PackageDoc } from '../../../../models/Package';
import {
  PackageEntityBuildParams,
  PackageEntityBuildResponse,
} from '../../../entities/package/packageEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type PartialFakeDbPackageFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};

class FakeDbPackageFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbPackageFactoryInitParams,
  PackageEntityBuildParams,
  PackageEntityBuildResponse,
  PackageDoc
> {
  private _fakeDbUserFactory!: FakeDbUserFactory;

  protected _createFakeBuildParams = async (): Promise<PackageEntityBuildParams> => {
    const fakeUser = await this._fakeDbUserFactory.createFakeDbUser();
    const fakeBuildParams = {
      hostedBy: fakeUser._id,
      lessonAmount: 5,
      packageType: 'light',
      isOffering: true,
      packageDurations: [30, 60],
    };
    return fakeBuildParams;
  };

  public createFakePackages = async (buildParams: { hostedBy: string }) => {
    const fakePackages = await this._createFakePackages(buildParams);
    const dbServiceAccessOptions = this.getDbServiceAccessOptions();
    const fakeInsertedPackages = await this._dbService.insertMany({
      modelToInsert: fakePackages,
      dbServiceAccessOptions,
    });
    return fakeInsertedPackages;
  };

  private _createFakePackages = async (buildParams: { hostedBy: string }) => {
    const { hostedBy } = buildParams;
    const lightPackage = await this._entity.build({
      hostedBy,
      lessonAmount: 5,
      packageType: 'light',
      isOffering: true,
      packageDurations: [30, 60],
    });
    const moderatePackage = await this._entity.build({
      hostedBy,
      lessonAmount: 12,
      packageType: 'moderate',
      isOffering: true,
      packageDurations: [30, 60],
    });
    const mainichiPackage = await this._entity.build({
      hostedBy,
      lessonAmount: 22,
      packageType: 'mainichi',
      isOffering: true,
      packageDurations: [30, 60],
    });
    return [lightPackage, moderatePackage, mainichiPackage];
  };
}

export { FakeDbPackageFactory };
