import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import {
  AvailableTimeEntityBuildParams,
  AvailableTimeEntityBuildResponse,
} from '../../../entities/availableTime/availableTimeEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type OptionalFakeDbAvailableTimeFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
  dayjs: any;
};

class FakeDbAvailableTimeFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbAvailableTimeFactoryInitParams,
  AvailableTimeEntityBuildParams,
  AvailableTimeEntityBuildResponse,
  AvailableTimeDoc
> {
  private _fakeDbUserFactory!: FakeDbUserFactory;
  private _dayjs!: any;

  protected _createFakeBuildParams = async (): Promise<AvailableTimeEntityBuildParams> => {
    const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
    const fakeBuildParams = {
      hostedById: fakeTeacher._id,
      startDate: this._dayjs().toDate(),
      endDate: this._dayjs().add(1, 'hour').toDate(),
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbAvailableTimeFactoryInitParams
  ) => {
    const { makeFakeDbUserFactory, dayjs } = optionalInitParams;
    this._fakeDbUserFactory = await makeFakeDbUserFactory;
    this._dayjs = dayjs;
  };
}

export { FakeDbAvailableTimeFactory };
