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
      hostedById: fakeUser._id.toString(),
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
