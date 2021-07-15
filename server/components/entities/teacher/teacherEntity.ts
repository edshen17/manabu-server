import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalTeacherEntityInitParams = {};

type TeacherEntityBuildParams = { userId: string };

type TeacherEntityBuildResponse = {
  userId: string;
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
};

class TeacherEntity extends AbstractEntity<
  OptionalTeacherEntityInitParams,
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse
> {
  protected _buildTemplate = (buildParams: { userId: string }): TeacherEntityBuildResponse => {
    const { userId } = buildParams;
    const teacherEntity = Object.freeze({
      userId,
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
    });
    return teacherEntity;
  };
}

export { TeacherEntity, TeacherEntityBuildParams, TeacherEntityBuildResponse };
