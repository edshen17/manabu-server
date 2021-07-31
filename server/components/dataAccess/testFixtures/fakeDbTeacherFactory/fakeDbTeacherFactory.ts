import {
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse,
} from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbEmbeddedDataFactory } from '../abstractions/AbstractFakeDbEmbeddedDataFactory';

class FakeDbTeacherFactory extends AbstractFakeDbEmbeddedDataFactory<
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse
> {
  public createFakeDbData = async (): Promise<TeacherEntityBuildResponse> => {
    const fakeBuildParams = await this._createFakeBuildParams();
    const fakeData = await this._entity.build(fakeBuildParams);
    fakeData.teachingLanguages.push({ language: 'ja', level: 'C2' });
    fakeData.alsoSpeaks.push({ language: 'en', level: 'C2' });
    return fakeData;
  };

  protected _createFakeBuildParams = async (): Promise<TeacherEntityBuildParams> => {
    const fakeBuildParams = {};
    return fakeBuildParams;
  };
}

export { FakeDbTeacherFactory };
