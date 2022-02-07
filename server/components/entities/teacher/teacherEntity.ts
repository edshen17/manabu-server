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
  teachingLanguages: { code: string; level: string }[];
  alsoSpeaks: { code: string; level: string }[];
  introductionVideoUrl: string;
  applicationStatus: string;
  type: string;
  licenseUrl: string;
  priceData: { hourlyRate: number; currency: string };
  settings: {
    isHidden: boolean;
    emailAlerts: {};
    payoutData: { email: string };
  };
  tags: string[];
  lessonCount: number;
  studentCount: number;
  createdDate: Date;
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
        emailAlerts: {},
        payoutData: { email: '' },
      },
      type: TEACHER_ENTITY_TYPE.UNLICENSED,
      licenseUrl: '',
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
    const trialPackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 1,
      type: PACKAGE_ENTITY_TYPE.DEFAULT,
      name: PACKAGE_ENTITY_NAME.TRIAL,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const lightPackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 5,
      type: PACKAGE_ENTITY_TYPE.DEFAULT,
      name: PACKAGE_ENTITY_NAME.LIGHT,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const moderatePackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 12,
      type: PACKAGE_ENTITY_TYPE.DEFAULT,
      name: PACKAGE_ENTITY_NAME.MODERATE,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const mainichiPackage = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 22,
      type: PACKAGE_ENTITY_TYPE.DEFAULT,
      name: PACKAGE_ENTITY_NAME.MAINICHI,
      isOffering: true,
      lessonDurations: [30, 60],
    });
    const customPackage1 = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 10,
      type: PACKAGE_ENTITY_TYPE.CUSTOM,
      name: `${PACKAGE_ENTITY_NAME.CUSTOM} 1`,
      isOffering: false,
      lessonDurations: [30, 60],
    });
    const customPackage2 = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 10,
      type: PACKAGE_ENTITY_TYPE.CUSTOM,
      name: `${PACKAGE_ENTITY_NAME.CUSTOM} 2`,
      isOffering: false,
      lessonDurations: [30, 60],
    });
    const customPackage3 = <PackageEntityBuildResponse>this._packageEntity.build({
      lessonAmount: 10,
      type: PACKAGE_ENTITY_TYPE.CUSTOM,
      name: `${PACKAGE_ENTITY_NAME.CUSTOM} 3`,
      isOffering: false,
      lessonDurations: [30, 60],
    });
    return [
      trialPackage,
      lightPackage,
      moderatePackage,
      mainichiPackage,
      customPackage1,
      customPackage2,
      customPackage3,
    ];
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalTeacherEntityInitParams
  ): Promise<void> => {
    const { makePackageEntity } = optionalInitParams;
    this._packageEntity = await makePackageEntity;
  };
}

export { TeacherEntity, TeacherEntityBuildParams, TeacherEntityBuildResponse, TEACHER_ENTITY_TYPE };
