import {
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse,
} from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbEmbeddedDataFactory } from '../abstractions/AbstractFakeDbEmbeddedDataFactory';

type OptionalFakeDbTeacherFactoryInitParams = {};

class FakeDbTeacherFactory extends AbstractFakeDbEmbeddedDataFactory<
  OptionalFakeDbTeacherFactoryInitParams,
  TeacherEntityBuildParams,
  TeacherEntityBuildResponse
> {
  public createFakeData = async (): Promise<TeacherEntityBuildResponse> => {
    const fakeBuildParams = await this._createFakeBuildParams();
    const fakeData = await this._entity.build(fakeBuildParams);
    fakeData.applicationStatus = 'approved';
    fakeData.teachingLanguages.push({ language: 'ja', level: 'C2' });
    fakeData.alsoSpeaks.push({ language: 'en', level: 'C2' });
    fakeData.settings.payoutData.email = 'payout-sdk-2@paypal.com';
    return fakeData;
  };

  protected _createFakeBuildParams = async (): Promise<TeacherEntityBuildParams> => {
    const fakeBuildParams = {};
    return fakeBuildParams;
  };
}

export { FakeDbTeacherFactory };
