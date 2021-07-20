import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalTeacherBalanceEntityInitParams = {};

type TeacherBalanceEntityBuildParams = { userId: ObjectId };

type TeacherBalanceEntityBuildResponse = {
  userId: ObjectId;
  balance: number;
  currency: string;
};

class TeacherBalanceEntity extends AbstractEntity<
  OptionalTeacherBalanceEntityInitParams,
  TeacherBalanceEntityBuildParams,
  TeacherBalanceEntityBuildResponse
> {
  protected _buildTemplate = (buildParams: TeacherBalanceEntityBuildParams) => {
    const { userId } = buildParams;
    const teacherBalanceEntity = Object.freeze({
      userId,
      balance: 0,
      currency: 'SGD',
    });
    return teacherBalanceEntity;
  };
}

export { TeacherBalanceEntity, TeacherBalanceEntityBuildParams, TeacherBalanceEntityBuildResponse };
