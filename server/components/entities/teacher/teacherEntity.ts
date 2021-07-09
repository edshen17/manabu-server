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
  hourlyRate: { amount: number; currency: string };
  tags: string[];
  lessonCount: number;
  studentCount: number;
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
      hourlyRate: { amount: 35, currency: 'SGD' },
      tags: [],
      lessonCount: 0,
      studentCount: 0,
    });
    return teacherEntity;
  };
}

export { TeacherEntity, TeacherEntityBuildParams, TeacherEntityBuildResponse };
