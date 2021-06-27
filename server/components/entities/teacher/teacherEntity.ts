import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type TeacherEntityParams = { userId: string };

type TeacherEntityResponse = {
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

class TeacherEntity
  extends AbstractEntity<TeacherEntityResponse>
  implements IEntity<TeacherEntityResponse>
{
  public build = (entityData: TeacherEntityParams): TeacherEntityResponse => {
    const teacherEntity = this._buildTeacherEntity(entityData);
    return teacherEntity;
  };

  private _buildTeacherEntity = (entityData: { userId: string }): TeacherEntityResponse => {
    const { userId } = entityData;
    return Object.freeze({
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
  };
}

export { TeacherEntity, TeacherEntityResponse };
