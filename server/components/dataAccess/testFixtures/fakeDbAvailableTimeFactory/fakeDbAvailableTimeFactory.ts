import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import {
  AvailableTimeEntityBuildParams,
  AvailableTimeEntityBuildResponse,
} from '../../../entities/availableTime/availableTimeEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type OptionalFakeDbAvailableTimeFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};

class FakeDbAvailableTimeFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbAvailableTimeFactoryInitParams,
  AvailableTimeEntityBuildParams,
  AvailableTimeEntityBuildResponse,
  AvailableTimeDoc
> {
  private _fakeDbUserFactory!: FakeDbUserFactory;

  protected _createFakeBuildParams = async (): Promise<AvailableTimeEntityBuildParams> => {
    const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
    const fakeBuildParams = {
      hostedById: fakeTeacher._id,
      startDate: new Date(),
      endDate: new Date(),
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbAvailableTimeFactoryInitParams
  ) => {
    const { makeFakeDbUserFactory } = optionalInitParams || {};
    this._fakeDbUserFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbAvailableTimeFactory };
