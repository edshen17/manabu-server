import { PackageEntity, PACKAGE_ENTITY_TYPE } from '../../../entities/package/packageEntity';
import {
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse,
} from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbEmbeddedDataFactory } from '../abstractions/AbstractFakeDbEmbeddedDataFactory';

type OptionalFakeDbTeacherFactoryInitParams = {
  makePackageEntity: Promise<PackageEntity>;
};

class FakeDbTeacherFactory extends AbstractFakeDbEmbeddedDataFactory<
  OptionalFakeDbTeacherFactoryInitParams,
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse
> {
  private _packageEntity!: PackageEntity;

  public createFakeDbData = async (): Promise<TeacherEntityBuildResponse> => {
    const fakeBuildParams = await this._createFakeBuildParams();
    const fakeData = await this._entity.build(fakeBuildParams);
    const fakeCustomPackage = await this._packageEntity.build({
      lessonAmount: 6,
      packageType: PACKAGE_ENTITY_TYPE.CUSTOM,
      packageName: 'custom package name',
      isOffering: true,
      lessonDurations: [30, 60, 90],
    });
    fakeData.teachingLanguages.push({ language: 'ja', level: 'C2' });
    fakeData.alsoSpeaks.push({ language: 'en', level: 'C2' });
    fakeData.packages.push(fakeCustomPackage);
    return fakeData;
  };

  protected _createFakeBuildParams = async (): Promise<TeacherEntityBuildParams> => {
    const fakeBuildParams = {};
    return fakeBuildParams;
  };

  protected _initTemplate = async (optionalInitParams: OptionalFakeDbTeacherFactoryInitParams) => {
    const { makePackageEntity } = optionalInitParams;
    this._packageEntity = await makePackageEntity;
  };
}

export { FakeDbTeacherFactory };
