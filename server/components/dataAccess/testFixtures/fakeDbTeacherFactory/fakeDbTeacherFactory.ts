import { TeacherDoc } from '../../../../models/Teacher';
import {
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse,
} from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type PartialFakeDbTeacherFactoryInitParams = {};

class FakeDbTeacherFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbTeacherFactoryInitParams,
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse,
  TeacherDoc
> {
  protected _createFakeBuildParams = async (): Promise<TeacherEntityBuildParams> => {
    // cannot use fakeDbUserFactory because it will create a cycle and thus be undefined
    const fakeBuildParams = {
      userId: 'some user id',
    };
    return fakeBuildParams;
  };
}

export { FakeDbTeacherFactory };
