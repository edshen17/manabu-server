import { PackageDoc } from '../../../../models/Package';
import { TeacherDoc } from '../../../../models/Teacher';
import { PackageEntity, PackageEntityResponse } from '../../../entities/package/packageEntity';
import { TeacherEntity } from '../../../entities/teacher/teacherEntity';
import { UserEntity, UserEntityResponse } from '../../../entities/user/userEntity';
import { PackageDbService } from '../../services/package/packageDbService';
import { TeacherDbService } from '../../services/teacher/teacherDbService';
import { JoinedUserDoc, UserDbService } from '../../services/user/userDbService';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';

class FakeDbUserFactory extends AbstractDbDataFactory<JoinedUserDoc, UserEntityResponse> {
  private faker!: any;
  private userEntity!: UserEntity;
  private teacherEntity!: TeacherEntity;
  private packageEntity!: PackageEntity;
  private userDbService!: UserDbService;
  private teacherDbService!: TeacherDbService;
  private packageDbService!: PackageDbService;

  public createFakeDbTeacherWithDefaultPackages = async (): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbUser();
    const fakeDbTeacher = await this._createFakeDbTeacher(fakeDbUser);
    const fakeDbPackages = await this._createFakeDbPackages(fakeDbUser);

    return this.userDbService.findById({
      _id: fakeDbUser._id,
      accessOptions: this.defaultAccessOptions,
    });
  };

  public createFakeDbUser = async (entityData?: { email: string }): Promise<JoinedUserDoc> => {
    const fakeUserEntity = this._createFakeEntity(entityData);
    let newUserCallback = this.userDbService.insert({
      modelToInsert: fakeUserEntity,
      accessOptions: this.defaultAccessOptions,
    });
    const fakeDbUser = await this._awaitDbInsert(newUserCallback);
    return fakeDbUser;
  };

  protected _createFakeEntity = (entityData?: { email: string }): UserEntityResponse => {
    const { email } = entityData || {};
    const fakeUserEntity = this.userEntity.build({
      name: this.faker.name.findName(),
      email: email || this.faker.internet.email(),
      password: this.faker.internet.password(),
      profileImage: this.faker.image.imageUrl(),
    });
    return fakeUserEntity;
  };

  private _createFakeDbTeacher = async (savedDbUser: JoinedUserDoc): Promise<TeacherDoc> => {
    const fakeTeacherEntity = this._createFakeTeacherEntity(savedDbUser);
    const newTeacherCallback = this.teacherDbService.insert({
      modelToInsert: fakeTeacherEntity,
      accessOptions: this.defaultAccessOptions,
    });
    const fakeDbTeacher = await this._awaitDbInsert(newTeacherCallback);
    return fakeDbTeacher;
  };

  private _createFakeTeacherEntity = (savedDbUser: JoinedUserDoc) => {
    const fakeTeacherEntity = this.teacherEntity.build({ userId: savedDbUser._id });
    return fakeTeacherEntity;
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

  public init = async (props: {
    faker: any;
    makeUserEntity: UserEntity;
    makeTeacherEntity: TeacherEntity;
    makePackageEntity: Promise<PackageEntity>;
    makeUserDbService: Promise<UserDbService>;
    makeTeacherDbService: Promise<TeacherDbService>;
    makePackageDbService: Promise<PackageDbService>;
  }) => {
    const {
      faker,
      makeUserEntity,
      makeTeacherEntity,
      makePackageEntity,
      makeUserDbService,
      makeTeacherDbService,
      makePackageDbService,
    } = props;
    this.faker = faker;
    this.userEntity = makeUserEntity;
    this.teacherEntity = makeTeacherEntity;
    this.packageEntity = await makePackageEntity;
    this.userDbService = await makeUserDbService;
    this.teacherDbService = await makeTeacherDbService;
    this.packageDbService = await makePackageDbService;
    return this;
  };
}

export { FakeDbUserFactory };
