import { UserEntityBuildResponse } from '../../../entities/user/userEntity';
import { JoinedUserDoc } from '../../services/user/userDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageFactory } from '../fakeDbPackageFactory/fakeDbPackageFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';

type FakeDbUserFactoryInitParams = {
  faker: any;
  makeFakeDbTeacherFactory: Promise<FakeDbTeacherFactory>;
  makeFakeDbPackageFactory: Promise<FakeDbPackageFactory>;
};

type FakeUserEntityParams = {
  name?: string;
  email?: string;
  password?: string;
};

class FakeDbUserFactory extends AbstractFakeDbDataFactory<
  FakeDbUserFactoryInitParams,
  FakeUserEntityParams,
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

    return await this._dbService.findById({
      _id: fakeDbUser._id,
      dbServiceAccessOptions: this._defaultDbAccessOptions,
    });
  };

  public createFakeDbUser = async (entityData?: FakeUserEntityParams): Promise<JoinedUserDoc> => {
    return await this.createFakeDbData(entityData);
  };

  protected _createFakeEntity = async (
    entityData?: FakeUserEntityParams
  ): Promise<UserEntityBuildResponse> => {
    const { name, email, password } = entityData || {};
    const fakeUserEntity = this._entity.build({
      name: name || this._faker.name.findName(),
      email: email || this._faker.internet.email(),
      password: password || this._faker.internet.password(),
      profileImage: this._faker.image.imageUrl(),
      commMethods: [{ method: 'LINE', id: this._faker.internet.userName() }],
    });
    return fakeUserEntity;
  };

  protected _initTemplate = async (props: any) => {
    const { faker, makeFakeDbTeacherFactory, makeFakeDbPackageFactory } = props;
    this._faker = faker;
    this._fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
    this._fakeDbPackageFactory = await makeFakeDbPackageFactory;
  };
}

export { FakeDbUserFactory };
