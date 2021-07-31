import { AbstractEntity } from '../abstractions/AbstractEntity';
import {
  PACKAGE_ENTITY_NAME,
  PackageEntity,
  PackageEntityBuildResponse,
} from '../package/packageEntity';

type OptionalTeacherEntityInitParams = {
  makePackageEntity: Promise<PackageEntity>;
};

type TeacherEntityBuildParams = {};

type TeacherEntityBuildResponse = {
  teachingLanguages: { language: string; level: string }[];
  alsoSpeaks: { language: string; level: string }[];
  introductionVideoUrl: string;
  applicationStatus: string;
  isHidden: boolean;
  teacherType: string;
  licensePathUrl: string;
  priceData: { hourlyRate: number; currency: string };
  tags: string[];
  lessonCount: number;
  studentCount: number;
  lastUpdated: Date;
  packages: PackageEntityBuildResponse[];
};

class TeacherEntity extends AbstractEntity<
  OptionalTeacherEntityInitParams,
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse
> {
  private _packageEntity!: PackageEntity;

  protected _buildTemplate = (
    buildParams: TeacherEntityBuildParams
  ): TeacherEntityBuildResponse => {
    const teacherEntity = Object.freeze({
      teachingLanguages: [],
      alsoSpeaks: [],
      introductionVideoUrl: '',
      applicationStatus: 'pending',
      isHidden: false,
      teacherType: 'unlicensed',
      licensePathUrl: '',
      priceData: { hourlyRate: 35, currency: 'SGD' },
      tags: [],
      lessonCount: 0,
      studentCount: 0,
      lastUpdated: new Date(),
      packages: this._createDefaultPackages(),
    });
    return teacherEntity;
  };

  private _createDefaultPackages = (): PackageEntityBuildResponse[] => {
    const lightPackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 5,
      packageType: 'default',
      packageName: PACKAGE_ENTITY_NAME.LIGHT,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const moderatePackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 12,
      packageType: 'default',
      packageName: PACKAGE_ENTITY_NAME.MODERATE,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const mainichiPackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 22,
      packageType: 'default',
      packageName: PACKAGE_ENTITY_NAME.MAINICHI,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    return [lightPackage, moderatePackage, mainichiPackage];
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalTeacherEntityInitParams
  ): Promise<void> => {
    const { makePackageEntity } = optionalInitParams;
    this._packageEntity = await makePackageEntity;
  };
}

export { TeacherEntity, TeacherEntityBuildParams, TeacherEntityBuildResponse };
