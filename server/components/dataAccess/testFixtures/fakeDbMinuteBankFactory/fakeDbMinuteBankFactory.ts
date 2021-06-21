import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { MinuteBankEntityResponse } from '../../../entities/minuteBank/minuteBankEntity';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

class FakeDbMinuteBankFactory extends AbstractDbDataFactory<
  MinuteBankDoc,
  MinuteBankEntityResponse
> {
  private fakeUserDbFactory!: FakeDbUserFactory;

  protected _createFakeEntity = async (entityData?: {
    hostedBy: any;
    reservedBy: any;
    minuteBank: number;
  }): Promise<MinuteBankEntityResponse> => {
    let { hostedBy, reservedBy, minuteBank } = entityData || {};
    if (!hostedBy) {
      const hostedByData = await this.fakeUserDbFactory.createFakeDbTeacherWithDefaultPackages();
      hostedBy = hostedByData._id;
    }
    if (!reservedBy) {
      const reservedByData = await this.fakeUserDbFactory.createFakeDbUser();
      reservedBy = reservedByData._id;
    }
    const fakeMinuteBankEntity = await this.entity.build({
      hostedBy,
      reservedBy,
      minuteBank: minuteBank || 0,
    });
    return fakeMinuteBankEntity;
  };

  protected _initTemplate = async (props: any) => {
    const { makeFakeDbUserFactory } = props || {};
    this.fakeUserDbFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbMinuteBankFactory };
