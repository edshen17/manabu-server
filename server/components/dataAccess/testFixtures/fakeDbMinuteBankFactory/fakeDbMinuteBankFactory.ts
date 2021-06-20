import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { MinuteBankEntityResponse } from '../../../entities/minuteBank/minuteBankEntity';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';

class FakeDbMinuteBankFactory extends AbstractDbDataFactory<
  MinuteBankDoc,
  MinuteBankEntityResponse
> {
  protected _createFakeEntity = async (entityData: {
    hostedBy: any;
    reservedBy: any;
  }): Promise<MinuteBankEntityResponse> => {
    const { hostedBy, reservedBy } = entityData;
    const fakeMinuteBankEntity = await this.entity.build({
      hostedBy,
      reservedBy,
      minuteBank: 0,
    });
    return fakeMinuteBankEntity;
  };
}

export { FakeDbMinuteBankFactory };
