import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

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
  public build = (entityData: { userId: string }): TeacherEntityResponse => {
    const { userId } = entityData;
    const TEACHER_ENTITY_DEFAULT_REQUIRED_VALUES = this._TEACHER_ENTITY_DEFAULT_REQUIRED_VALUES();
    return Object.freeze({
      userId,
      ...TEACHER_ENTITY_DEFAULT_REQUIRED_VALUES,
    });
  };

  private _TEACHER_ENTITY_DEFAULT_REQUIRED_VALUES = () => {
    return Object.freeze({
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

export { TeacherEntity };
