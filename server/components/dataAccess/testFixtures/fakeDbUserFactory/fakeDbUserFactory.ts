import { UserEntityBuildParams, UserEntityBuildResponse } from '../../../entities/user/userEntity';
import { JoinedUserDoc } from '../../services/user/userDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageFactory } from '../fakeDbPackageFactory/fakeDbPackageFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';

type OptionalFakeDbUserFactoryInitParams = {
  faker: any;
  makeFakeDbTeacherFactory: Promise<FakeDbTeacherFactory>;
  makeFakeDbPackageFactory: Promise<FakeDbPackageFactory>;
};

class FakeDbUserFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbUserFactoryInitParams,
  UserEntityBuildParams,
  UserEntityBuildResponse,
  JoinedUserDoc
> {
  private _faker: any;
  private _fakeDbTeacherFactory!: FakeDbTeacherFactory;
  private _fakeDbPackageFactory!: FakeDbPackageFactory;

  public createFakeDbTeacherWithDefaultPackages = async (): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbUser();
    const fakeDbTeacher = await this._fakeDbTeacherFactory.createFakeDbData({
      userId: fakeDbUser._id.toString(),
    });
    const fakeDbPackages = await this._fakeDbPackageFactory.createFakePackages({
      hostedBy: fakeDbUser._id.toString(),
    });

    const fakeDbUserData = await this._dbService.findById({
      _id: fakeDbUser._id.toString(),
      dbServiceAccessOptions: this._dbServiceAccessOptions,
    });
    return fakeDbUserData;
  };

  public createFakeDbUser = async (): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbData();
    return fakeDbUser;
  };

  protected _createFakeBuildParams = async (): Promise<UserEntityBuildParams> => {
    const fakeBuildParams = {
      name: this._faker.name.findName(),
      email: this._faker.internet.email(),
      password: `${this._faker.internet.password()}StrongP@ssW0rd!`,
      profileImageUrl: this._faker.image.imageUrl(),
      contactMethods: [
        {
          methodName: 'LINE',
          methodType: 'online',
          methodId: this._faker.internet.userName(),
          isPrimaryMethod: true,
        },
      ],
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    partialFakeDbDataFactoryInitParams: OptionalFakeDbUserFactoryInitParams
  ) => {
    const { faker, makeFakeDbTeacherFactory, makeFakeDbPackageFactory } =
      partialFakeDbDataFactoryInitParams;
    this._faker = faker;
    this._fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
    this._fakeDbPackageFactory = await makeFakeDbPackageFactory;
  };
}

export { FakeDbUserFactory };
