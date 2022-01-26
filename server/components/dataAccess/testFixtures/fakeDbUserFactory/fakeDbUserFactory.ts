import { JoinedUserDoc } from '../../../../models/User';
import { UserEntityBuildParams, UserEntityBuildResponse } from '../../../entities/user/userEntity';
import { GraphDbService } from '../../services/graph/graphDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbTeacherFactory } from '../fakeDbTeacherFactory/fakeDbTeacherFactory';

type OptionalFakeDbUserFactoryInitParams = {
  faker: any;
  makeFakeDbTeacherFactory: Promise<FakeDbTeacherFactory>;
  makeGraphDbService: Promise<GraphDbService>;
};

class FakeDbUserFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbUserFactoryInitParams,
  UserEntityBuildParams,
  UserEntityBuildResponse,
  JoinedUserDoc
> {
  private _faker: any;
  private _fakeDbTeacherFactory!: FakeDbTeacherFactory;
  private _graphDbService!: GraphDbService;

  public createFakeDbTeacher = async (): Promise<JoinedUserDoc> => {
    const fakeBuildParams = await this._createFakeBuildParams();
    fakeBuildParams.teacherData = await this._fakeDbTeacherFactory.createFakeData();
    const fakeDbTeacher = await this.createFakeDbData(fakeBuildParams);
    const dbServiceAccessOptions = this._dbService.getBaseDbServiceAccessOptions();
    await this._graphDbService.createUserNode({ user: fakeDbTeacher, dbServiceAccessOptions });
    return fakeDbTeacher;
  };

  public createFakeDbUser = async (): Promise<JoinedUserDoc> => {
    const fakeDbUser = await this.createFakeDbData();
    const dbServiceAccessOptions = this._dbService.getBaseDbServiceAccessOptions();
    await this._graphDbService.createUserNode({ user: fakeDbUser, dbServiceAccessOptions });
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
          name: 'line',
          type: 'online',
          address: this._faker.internet.userName(),
          isPrimaryMethod: true,
        },
      ],
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (optionalInitParams: OptionalFakeDbUserFactoryInitParams) => {
    const { faker, makeFakeDbTeacherFactory, makeGraphDbService } = optionalInitParams;
    this._faker = faker;
    this._fakeDbTeacherFactory = await makeFakeDbTeacherFactory;
    this._graphDbService = await makeGraphDbService;
  };
}

export { FakeDbUserFactory };
