import { UserEntityBuildResponse } from '../../../entities/user/userEntity';
import { JoinedUserDoc } from '../../services/user/userDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageFactory } from '../fakeDbPackageFactory/fakeDbPackageFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';

type PartialFakeDbUserFactoryInitParams = {
  faker: any;
  makeFakeDbTeacherFactory: Promise<FakeDbTeacherFactory>;
  makeFakeDbPackageFactory: Promise<FakeDbPackageFactory>;
};

type FakeUserEntityBuildParams = {
  name?: string;
  email?: string;
  password?: string;
};

class FakeDbUserFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbUserFactoryInitParams,
  FakeUserEntityBuildParams,
  UserEntityBuildResponse,
  JoinedUserDoc
> {
  private _faker!: any;
  private _fakeDbTeacherFactory!: FakeDbTeacherFactory;
  private _fakeDbPackageFactory!: FakeDbPackageFactory;

  public createFakeDbTeacherWithDefaultPackages = async (): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbUser();
    const fakeDbTeacher = await this._fakeDbTeacherFactory.createFakeDbData({
      userId: fakeDbUser._id,
    });
    const fakeDbPackages = await this._fakeDbPackageFactory.createFakePackages({
      hostedBy: fakeDbUser._id,
    });

    const fakeDbUserData = await this._dbService.findById({
      _id: fakeDbUser._id,
      dbServiceAccessOptions: this._dbServiceAccessOptions,
    });
    return fakeDbUserData;
  };

  public createFakeDbUser = async (
    fakeEntityBuildParams?: FakeUserEntityBuildParams
  ): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbData(fakeEntityBuildParams);
    return fakeDbUser;
  };

  protected _createFakeEntity = async (
    fakeEntityBuildParams?: FakeUserEntityBuildParams
  ): Promise<UserEntityBuildResponse> => {
    const { name, email, password } = fakeEntityBuildParams || {};
    const fakeUserEntity = await this._entity.build({
      name: name || this._faker.name.findName(),
      email: email || this._faker.internet.email(),
      password: password || this._faker.internet.password(),
      profileImage: this._faker.image.imageUrl(),
      commMethods: [{ method: 'LINE', id: this._faker.internet.userName() }],
    });
    return fakeUserEntity;
  };

  protected _initTemplate = async (
    partialFakeDbDataFactoryInitParams: PartialFakeDbUserFactoryInitParams
  ) => {
    const { faker, makeFakeDbTeacherFactory, makeFakeDbPackageFactory } =
      partialFakeDbDataFactoryInitParams;
    this._faker = faker;
    this._fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
    this._fakeDbPackageFactory = await makeFakeDbPackageFactory;
  };
}

export { FakeDbUserFactory };
