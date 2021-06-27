import { UserEntityResponse } from '../../../entities/user/userEntity';
import { JoinedUserDoc } from '../../services/user/userDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageFactory } from '../fakeDbPackageFactory/fakeDbPackageFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';

class FakeDbUserFactory extends AbstractFakeDbDataFactory<JoinedUserDoc, UserEntityResponse> {
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

    return this._dbService.findById({
      _id: fakeDbUser._id,
      accessOptions: this._defaultAccessOptions,
    });
  };

  public createFakeDbUser = async (entityData?: { email: string }): Promise<JoinedUserDoc> => {
    return await this.createFakeDbData(entityData);
  };

  protected _createFakeEntity = async (entityData?: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserEntityResponse> => {
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
