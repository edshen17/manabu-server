import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { MinuteBankEntityBuildResponse } from '../../../entities/minuteBank/minuteBankEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type FakeDbMinuteBankFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};

type FakeMinuteBankEntityParams = {
  hostedBy?: string;
  reservedBy?: string;
  minuteBank?: number;
};

class FakeDbMinuteBankFactory extends AbstractFakeDbDataFactory<
  FakeDbMinuteBankFactoryInitParams,
  FakeMinuteBankEntityParams,
  MinuteBankEntityBuildResponse,
  MinuteBankDoc
> {
  private _fakeUserDbFactory!: FakeDbUserFactory;

  protected _createFakeEntity = async (
    entityData?: FakeMinuteBankEntityParams
  ): Promise<MinuteBankEntityBuildResponse> => {
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
