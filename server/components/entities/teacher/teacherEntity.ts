import { DEFAULT_CURRENCY } from '../../../constants';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import {
  PackageEntity,
  PackageEntityBuildResponse,
  PACKAGE_ENTITY_NAME,
  PACKAGE_ENTITY_TYPE,
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
  teacherType: string;
  licensePathUrl: string;
  priceData: { hourlyRate: number; currency: string };
  settings: {
    isHidden: boolean;
    emailAlerts: { packageTransactionCreation: boolean };
    payoutData: { email: string };
  };
  tags: string[];
  lessonCount: number;
  studentCount: number;
  lastModifiedDate: Date;
  packages: PackageEntityBuildResponse[];
};

enum TEACHER_ENTITY_TYPE {
  LICENSED = 'licensed',
  UNLICENSED = 'unlicensed',
}

class TeacherEntity extends AbstractEntity<
  OptionalTeacherEntityInitParams,
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse
> {
  private _packageEntity!: PackageEntity;

  protected _buildTemplate = (
    buildParams: TeacherEntityBuildParams
  ): TeacherEntityBuildResponse => {
    const teacherEntity = {
      teachingLanguages: [],
      alsoSpeaks: [],
      introductionVideoUrl: '',
      applicationStatus: 'pending',
      settings: {
        isHidden: false,
        emailAlerts: { packageTransactionCreation: true },
        payoutData: { email: '' },
      },
      teacherType: TEACHER_ENTITY_TYPE.UNLICENSED,
      licensePathUrl: '',
      priceData: { hourlyRate: 30, currency: DEFAULT_CURRENCY },
      tags: [],
      lessonCount: 0,
      studentCount: 0,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
      packages: this._createPackages(),
    };
    return teacherEntity;
  };

  private _createPackages = (): PackageEntityBuildResponse[] => {
    const lightPackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 5,
      packageType: PACKAGE_ENTITY_TYPE.DEFAULT,
      packageName: PACKAGE_ENTITY_NAME.LIGHT,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const moderatePackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 12,
      packageType: PACKAGE_ENTITY_TYPE.DEFAULT,
      packageName: PACKAGE_ENTITY_NAME.MODERATE,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const mainichiPackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 22,
      packageType: PACKAGE_ENTITY_TYPE.DEFAULT,
      packageName: PACKAGE_ENTITY_NAME.MAINICHI,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const customPackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 10,
      packageType: PACKAGE_ENTITY_TYPE.CUSTOM,
      packageName: PACKAGE_ENTITY_NAME.CUSTOM,
      isOffering: false,
      lessonDurations: [30, 60],
    });
    return [lightPackage, moderatePackage, mainichiPackage, customPackage];
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalTeacherEntityInitParams
  ): Promise<void> => {
    const { makePackageEntity } = optionalInitParams;
    this._packageEntity = await makePackageEntity;
  };
}

export { TeacherEntity, TeacherEntityBuildParams, TeacherEntityBuildResponse, TEACHER_ENTITY_TYPE };
