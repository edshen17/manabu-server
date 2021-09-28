import { JoinedUserDoc } from '../../../../models/User';
import { UserEntityBuildParams, UserEntityBuildResponse } from '../../../entities/user/userEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';

type OptionalFakeDbUserFactoryInitParams = {
  faker: any;
  makeFakeDbTeacherFactory: Promise<FakeDbTeacherFactory>;
};

class FakeDbUserFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbUserFactoryInitParams,
  UserEntityBuildParams,
  UserEntityBuildResponse,
  JoinedUserDoc
> {
  private _faker: any;
  private _fakeDbTeacherFactory!: FakeDbTeacherFactory;

  public createFakeDbTeacherWithPackages = async (): Promise<JoinedUserDoc> => {
    const fakeBuildParams = await this._createFakeBuildParams();
    fakeBuildParams.teacherData = await this._fakeDbTeacherFactory.createFakeData();
    const fakeDbTeacher = await this.createFakeDbData(fakeBuildParams);
    return fakeDbTeacher;
  };

  public createFakeDbUser = async (): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbData();
    return fakeDbUser;
  };

  protected _createFakeBuildParams = async (): Promise<UserEntityBuildParams> => {
    const fakeBuildParams = {
      name: this._faker.name.findName(),
      email: this._faker.internet.email(),
      password: this._faker.internet.password(),
      profileImageUrl: this._faker.image.imageUrl(),
      contactMethods: [
        {
          methodName: 'LINE',
          methodType: 'online',
          methodAddress: this._faker.internet.userName(),
          isPrimaryMethod: true,
        },
      ],
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (optionalInitParams: OptionalFakeDbUserFactoryInitParams) => {
    const { faker, makeFakeDbTeacherFactory } = optionalInitParams;
    this._faker = faker;
    this._fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
  };
}

export { FakeDbUserFactory };
