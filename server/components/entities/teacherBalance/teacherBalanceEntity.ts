import { IEntity } from '../abstractions/IEntity';

class TeacherBalanceEntity implements IEntity {
  build(teacherBalanceData: any): any {
    const { userId } = teacherBalanceData;
    return Object.freeze({
      getUserId: () => userId,
    });
  }
}

export { TeacherBalanceEntity };
