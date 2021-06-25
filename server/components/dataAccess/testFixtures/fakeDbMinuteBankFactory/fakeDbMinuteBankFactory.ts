import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { MinuteBankEntityResponse } from '../../../entities/minuteBank/minuteBankEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

class FakeDbMinuteBankFactory extends AbstractFakeDbDataFactory<
  MinuteBankDoc,
  MinuteBankEntityResponse
> {
  private _fakeUserDbFactory!: FakeDbUserFactory;

  protected _createFakeEntity = async (entityData?: {
    hostedBy: any;
    reservedBy: any;
    minuteBank: number;
  }): Promise<MinuteBankEntityResponse> => {
    let { hostedBy, reservedBy, minuteBank } = entityData || {};
    if (!hostedBy) {
      const hostedByData = await this._fakeUserDbFactory.createFakeDbTeacherWithDefaultPackages();
      hostedBy = hostedByData._id;
    }
    if (!reservedBy) {
      const reservedByData = await this._fakeUserDbFactory.createFakeDbUser();
      reservedBy = reservedByData._id;
    }
    const fakeMinuteBankEntity = await this._entity.build({
      hostedBy,
      reservedBy,
      minuteBank: minuteBank || 0,
    });
    return fakeMinuteBankEntity;
  };

  protected _initTemplate = async (props: any) => {
    const { makeFakeDbUserFactory } = props || {};
    this._fakeUserDbFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbMinuteBankFactory };
