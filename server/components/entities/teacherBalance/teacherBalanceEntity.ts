import { IEntity } from '../abstractions/IEntity';

class TeacherBalanceEntity implements IEntity {
  build(teacherBalanceData: any): any {
    const { userId } = teacherBalanceData;
    return Object.freeze({ userId });
  }
}

export { TeacherBalanceEntity };
