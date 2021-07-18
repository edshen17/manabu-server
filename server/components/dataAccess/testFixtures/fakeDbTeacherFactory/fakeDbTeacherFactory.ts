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
  public createFakeData = async (): Promise<TeacherEntityBuildResponse> => {
    const fakeBuildParams = await this._createFakeBuildParams();
    const fakeData = this._entity.build(fakeBuildParams);
    return fakeData;
  };

  protected _createFakeBuildParams = async (): Promise<TeacherEntityBuildParams> => {
    const fakeBuildParams = {};
    return fakeBuildParams;
  };
}

export { FakeDbTeacherFactory };
