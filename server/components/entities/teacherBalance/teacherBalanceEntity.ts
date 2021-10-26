import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalTeacherBalanceEntityInitParams = {};

type TeacherBalanceEntityBuildParams = { userId: ObjectId };

type TeacherBalanceEntityBuildResponse = {
  userId: ObjectId;
  balance: number;
  currency: string;
  createdDate: Date;
  lastModifiedDate: Date;
};

class TeacherBalanceEntity extends AbstractEntity<
  OptionalTeacherBalanceEntityInitParams,
  TeacherBalanceEntityBuildParams,
  TeacherBalanceEntityBuildResponse
> {
  protected _buildTemplate = (buildParams: TeacherBalanceEntityBuildParams) => {
    const { userId } = buildParams;
    const teacherBalanceEntity = {
      userId,
      balance: 0,
      currency: 'SGD',
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    };
    return teacherBalanceEntity;
  };
}

export { TeacherBalanceEntity, TeacherBalanceEntityBuildParams, TeacherBalanceEntityBuildResponse };
