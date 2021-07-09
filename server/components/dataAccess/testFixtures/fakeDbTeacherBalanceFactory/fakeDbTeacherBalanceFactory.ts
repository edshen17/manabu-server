import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import {
  TeacherBalanceEntityBuildParams,
  TeacherBalanceEntityBuildResponse,
} from '../../../entities/teacherBalance/teacherBalanceEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type OptionalFakeDbTeacherBalanceFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};

class FakeDbTeacherBalanceFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbTeacherBalanceFactoryInitParams,
  TeacherBalanceEntityBuildParams,
  TeacherBalanceEntityBuildResponse,
  TeacherBalanceDoc
> {
  private _fakeDbUserFactory!: FakeDbUserFactory;

  protected _createFakeBuildParams = async (): Promise<TeacherBalanceEntityBuildParams> => {
    const fakeUser = await this._fakeDbUserFactory.createFakeDbUser();
    const fakeBuildParams = {
      userId: fakeUser._id.toString(),
    };
    return fakeBuildParams;
  };
}

export { FakeDbTeacherBalanceFactory };
