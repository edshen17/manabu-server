import { IEntity } from '../abstractions/IEntity';

class TeacherEntity implements IEntity {
  build(teacherData: any): any {
    const { userId } = teacherData.userId;
    return Object.freeze({
      getUserId: () => userId,
    });
  }
}

export { TeacherEntity };
