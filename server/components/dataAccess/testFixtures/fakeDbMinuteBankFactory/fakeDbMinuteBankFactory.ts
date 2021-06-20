import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { MinuteBankEntityResponse } from '../../../entities/minuteBank/minuteBankEntity';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

class FakeDbMinuteBankFactory extends AbstractDbDataFactory<
  MinuteBankDoc,
  MinuteBankEntityResponse
> {
  private fakeUserDbFactory!: FakeDbUserFactory;

  protected _createFakeEntity = async (entityData: {
    hostedBy: any;
    reservedBy: any;
  }): Promise<MinuteBankEntityResponse> => {
    let { hostedBy, reservedBy } = entityData;
    if (!hostedBy) {
      hostedBy = await this.fakeUserDbFactory.createFakeDbTeacherWithDefaultPackages();
    }
    if (!reservedBy) {
      reservedBy = await this.fakeUserDbFactory.createFakeDbUser();
    }
    const fakeMinuteBankEntity = await this.entity.build({
      hostedBy,
      reservedBy,
      minuteBank: 0,
    });
    return fakeMinuteBankEntity;
  };

  public init = async (
    props:
      | {
          makeEntity: any;
          makeDbService: Promise<any>;
          cloneDeep: any;
          makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
        }
      | any
  ): Promise<this> => {
    const { makeEntity, makeDbService, cloneDeep } = props;
    this.entity = await makeEntity;
    this.dbService = await makeDbService;
    this.fakeUserDbFactory = await makeFakeDbUserFactory;
    this.cloneDeep = cloneDeep;
    return this;
  };
}

export { FakeDbMinuteBankFactory };
