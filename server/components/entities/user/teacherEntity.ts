import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

class TeacherEntity extends AbstractEntity implements IEntity {
  build(entityData: { userId: string }): any {
    const { userId } = entityData;
    return Object.freeze({
      userId,
      teachingLanguages: [],
      alsoSpeaks: [],
      introductionVideo: '',
      isApproved: false,
      isHidden: 'false',
      teacherType: 'unlicensed',
      licensePath: '',
      hourlyRate: { amount: '35', currency: 'SGD' },
      lessonCount: 0,
      studentCount: 0,
    });
  }
}

export { TeacherEntity };
