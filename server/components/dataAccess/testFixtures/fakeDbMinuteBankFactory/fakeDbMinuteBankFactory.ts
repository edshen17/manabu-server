import { MinuteBankDoc } from '../../../../models/MinuteBank';
import {
  MinuteBankEntityBuildParams,
  MinuteBankEntityBuildResponse
} from '../../../entities/minuteBank/minuteBankEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type OptionalFakeDbMinuteBankFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};

class FakeDbMinuteBankFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbMinuteBankFactoryInitParams,
  MinuteBankEntityBuildParams,
  MinuteBankEntityBuildResponse,
  MinuteBankDoc
> {
  private _fakeDbUserFactory!: FakeDbUserFactory;

  protected _createFakeBuildParams = async (): Promise<MinuteBankEntityBuildParams> => {
    const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
    const fakeUser = await this._fakeDbUserFactory.createFakeDbUser();
    const fakeBuildParams = {
      hostedById: fakeTeacher._id,
      reservedById: fakeUser._id,
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbMinuteBankFactoryInitParams
  ) => {
    const { makeFakeDbUserFactory } = optionalInitParams || {};
    this._fakeDbUserFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbMinuteBankFactory };

