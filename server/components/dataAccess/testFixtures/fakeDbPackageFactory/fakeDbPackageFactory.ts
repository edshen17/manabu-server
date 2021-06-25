import { PackageDoc } from '../../../../models/Package';
import { PackageEntityResponse } from '../../../entities/package/packageEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

class FakeDbPackageFactory extends AbstractFakeDbDataFactory<PackageDoc, PackageEntityResponse> {
  public createFakePackages = async (entityData: { hostedBy: any }) => {
    const defaultPackages = await this._createDefaultPackages(entityData);
    const accessOptions = this.getDefaultAccessOptions();
    const insertedPackages = await this._dbService.insertMany({
      modelToInsert: defaultPackages,
      accessOptions,
    });
    return insertedPackages;
  };

  private _createDefaultPackages = async (entityData: { hostedBy: any }) => {
    const { hostedBy } = entityData;
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
