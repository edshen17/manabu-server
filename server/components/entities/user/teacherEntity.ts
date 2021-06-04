import { IEntity } from '../abstractions/IEntity';

class TeacherEntity implements IEntity {
  build(teacherData: any): any {
    const { userId } = teacherData;
    return Object.freeze({
      userId,
    });
  }
}

export { TeacherEntity };
