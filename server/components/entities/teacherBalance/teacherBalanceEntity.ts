import { AbstractEntity } from '../abstractions/AbstractEntity';

type TeacherBalanceEntityInitParams = {};

type TeacherBalanceEntityBuildParams = { userId: string };

type TeacherBalanceEntityBuildResponse = {
  userId: string;
  balanceDetails: {
    balance: number;
    currency: string;
  };
};

class TeacherBalanceEntity extends AbstractEntity<
  TeacherBalanceEntityInitParams,
  TeacherBalanceEntityBuildParams,
  TeacherBalanceEntityBuildResponse
> {
  build(buildParams: TeacherBalanceEntityBuildParams): any {
    const { userId } = buildParams;
    const teacherBalanceEntity = Object.freeze({
      userId,
      balanceDetails: {
        balance: 0,
        currency: 'SGD',
      },
    });
    return teacherBalanceEntity;
  }
}

export { TeacherBalanceEntity, TeacherBalanceEntityBuildParams, TeacherBalanceEntityBuildResponse };
