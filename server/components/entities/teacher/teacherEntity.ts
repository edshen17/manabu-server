import { AbstractEntity } from '../abstractions/AbstractEntity';

type TeacherEntityInitParams = {};

type TeacherEntityBuildParams = { userId: string };

type TeacherEntityBuildResponse = {
  userId: string;
  teachingLanguages: { language: string; level: string }[];
  alsoSpeaks: { language: string; level: string }[];
  introductionVideo: string;
  isApproved: boolean;
  isHidden: boolean;
  teacherType: string;
  licensePath: string;
  hourlyRate: { amount: number; currency: string };
  lessonCount: number;
  studentCount: number;
};

class TeacherEntity extends AbstractEntity<
  TeacherEntityInitParams,
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse
> {
  public build = (buildParams: TeacherEntityBuildParams): TeacherEntityBuildResponse => {
    const teacherEntity = this._buildTeacherEntity(buildParams);
    return teacherEntity;
  };

  private _buildTeacherEntity = (buildParams: { userId: string }): TeacherEntityBuildResponse => {
    const { userId } = buildParams;
    const teacherEntity = Object.freeze({
      userId,
      teachingLanguages: [],
      alsoSpeaks: [],
      introductionVideo: '',
      isApproved: false,
      isHidden: false,
      teacherType: 'unlicensed',
      licensePath: '',
      hourlyRate: { amount: 35, currency: 'SGD' },
      lessonCount: 0,
      studentCount: 0,
    });
    return teacherEntity;
  };
}

export { TeacherEntity, TeacherEntityBuildParams, TeacherEntityBuildResponse };
