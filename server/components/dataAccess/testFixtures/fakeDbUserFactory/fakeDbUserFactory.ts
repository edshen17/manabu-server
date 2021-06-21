import { PackageDoc } from '../../../../models/Package';
import { PackageEntity, PackageEntityResponse } from '../../../entities/package/packageEntity';
import { UserEntityResponse } from '../../../entities/user/userEntity';
import { PackageDbService } from '../../services/package/packageDbService';
import { JoinedUserDoc } from '../../services/user/userDbService';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';

class FakeDbUserFactory extends AbstractDbDataFactory<JoinedUserDoc, UserEntityResponse> {
  private faker!: any;
  private packageEntity!: PackageEntity;
  private fakeDbTeacherFactory!: FakeDbTeacherFactory;
  private packageDbService!: PackageDbService;

  public createFakeDbTeacherWithDefaultPackages = async (): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbUser();
    const fakeDbTeacher = await this.fakeDbTeacherFactory.createFakeDbData({
      userId: fakeDbUser._id,
    });
    const fakeDbPackages = await this._createFakeDbPackages(fakeDbUser);

    return this.dbService.findById({
      _id: fakeDbUser._id,
      accessOptions: this.defaultAccessOptions,
    });
  };

  public createFakeDbUser = async (entityData?: { email: string }): Promise<JoinedUserDoc> => {
    return await this.createFakeDbData(entityData);
  };

  protected _createFakeEntity = (entityData?: {
    email: string;
  }): UserEntityResponse | Promise<UserEntityResponse> => {
    const { email } = entityData || {};
    const fakeUserEntity = this.entity.build({
      name: this.faker.name.findName(),
      email: email || this.faker.internet.email(),
      password: this.faker.internet.password(),
      profileImage: this.faker.image.imageUrl(),
    });
    return fakeUserEntity;
  };

  private _createFakeDbPackages = async (savedDbUser: JoinedUserDoc): Promise<PackageDoc> => {
    const fakePackageEntities = await this._createFakePackageEntities(savedDbUser);
    const newPackageCallback = this.packageDbService.insert({
      modelToInsert: fakePackageEntities,
      accessOptions: this.defaultAccessOptions,
    });
    return await this._awaitDbInsert(newPackageCallback);
  };

  private _createFakePackageEntities = async (
    savedDbUser: JoinedUserDoc
  ): Promise<PackageEntityResponse[]> => {
    const fakeLightPackageEntity = await this.packageEntity.build({
      hostedBy: savedDbUser._id,
      lessonAmount: 5,
      isOffering: true,
      packageType: 'light',
    });
    const fakeModeratePackageEntity = await this.packageEntity.build({
      hostedBy: savedDbUser._id,
      lessonAmount: 12,
      isOffering: true,
      packageType: 'moderate',
    });
    const fakeMainichiPackageEntity = await this.packageEntity.build({
      hostedBy: savedDbUser._id,
      lessonAmount: 22,
      isOffering: true,
      packageType: 'mainichi',
    });
    return [fakeLightPackageEntity, fakeModeratePackageEntity, fakeMainichiPackageEntity];
  };

  protected _initTemplate = async (props: any) => {
    const { faker, makeFakeDbTeacherFactory, makePackageEntity, makePackageDbService } = props;
    this.faker = faker;
    this.packageEntity = await makePackageEntity;
    this.packageDbService = await makePackageDbService;
    this.fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
  };
}

export { FakeDbUserFactory };
