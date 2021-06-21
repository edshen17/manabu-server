import { TeacherDoc } from '../../../../models/Teacher';
import { TeacherEntityResponse } from '../../../entities/teacher/teacherEntity';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';

class FakeDbTeacherFactory extends AbstractDbDataFactory<TeacherDoc, TeacherEntityResponse> {
  protected _createFakeEntity = async (entityData?: {
    userId: any;
  }): Promise<TeacherEntityResponse> => {
    let { userId } = entityData || {};
    const fakeTeacherEntity = await this.entity.build({
      userId,
    });
    return fakeTeacherEntity;
  };
}

export { FakeDbTeacherFactory };
