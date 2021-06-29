import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { MinuteBankEntityBuildResponse } from '../../../entities/minuteBank/minuteBankEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type PartialFakeDbMinuteBankFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};

type FakeMinuteBankEntityBuildParams = {
  hostedBy?: string;
  reservedBy?: string;
  minuteBank?: number;
};

class FakeDbMinuteBankFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbMinuteBankFactoryInitParams,
  FakeMinuteBankEntityBuildParams,
  MinuteBankEntityBuildResponse,
  MinuteBankDoc
> {
  private _fakeUserDbFactory!: FakeDbUserFactory;

  protected _createFakeEntity = async (
    fakeEntityBuildParams?: FakeMinuteBankEntityBuildParams
  ): Promise<MinuteBankEntityBuildResponse> => {
    let { hostedBy, reservedBy, minuteBank } = fakeEntityBuildParams || {};
    const fakeHostedByData = await this._fakeUserDbFactory.createFakeDbTeacherWithDefaultPackages();
    const fakeReservedByData = await this._fakeUserDbFactory.createFakeDbUser();
    const fakeMinuteBankEntity = await this._entity.build({
      hostedBy: hostedBy || fakeHostedByData._id,
      reservedBy: reservedBy || fakeReservedByData._id,
      minuteBank: minuteBank || 0,
    });
    return fakeMinuteBankEntity;
  };

  protected _initTemplate = async (
    partialFakeDbDataFactoryInitParams: PartialFakeDbMinuteBankFactoryInitParams
  ) => {
    const { makeFakeDbUserFactory } = partialFakeDbDataFactoryInitParams || {};
    this._fakeUserDbFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbMinuteBankFactory };
