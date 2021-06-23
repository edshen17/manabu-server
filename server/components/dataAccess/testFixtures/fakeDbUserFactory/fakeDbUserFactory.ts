import { UserEntityResponse } from '../../../entities/user/userEntity';
import { JoinedUserDoc } from '../../services/user/userDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageFactory } from '../fakeDbPackageFactory/fakeDbPackageFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';

class FakeDbUserFactory extends AbstractFakeDbDataFactory<JoinedUserDoc, UserEntityResponse> {
  private faker!: any;
  private fakeDbTeacherFactory!: FakeDbTeacherFactory;
  private fakeDbPackageFactory!: FakeDbPackageFactory;

  public createFakeDbTeacherWithDefaultPackages = async (): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbUser();
    const fakeDbTeacher = await this.fakeDbTeacherFactory.createFakeDbData({
      userId: fakeDbUser._id,
    });
    const fakeDbPackages = await this.fakeDbPackageFactory.createFakePackages({
      hostedBy: fakeDbUser._id,
    });

    return this.dbService.findById({
      _id: fakeDbUser._id,
      accessOptions: this.defaultAccessOptions,
    });
  };

  public createFakeDbUser = async (entityData?: { email: string }): Promise<JoinedUserDoc> => {
    return await this.createFakeDbData(entityData);
  };

  protected _createFakeEntity = async (entityData?: {
    email: string;
  }): Promise<UserEntityResponse> => {
    const { email } = entityData || {};
    const fakeUserEntity = this.entity.build({
      name: this.faker.name.findName(),
      email: email || this.faker.internet.email(),
      password: this.faker.internet.password(),
      profileImage: this.faker.image.imageUrl(),
    });
    return fakeUserEntity;
  };

  protected _initTemplate = async (props: any) => {
    const { faker, makeFakeDbTeacherFactory, makeFakeDbPackageFactory } = props;
    this.faker = faker;
    this.fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
    this.fakeDbPackageFactory = await makeFakeDbPackageFactory;
  };
}

export { FakeDbUserFactory };
