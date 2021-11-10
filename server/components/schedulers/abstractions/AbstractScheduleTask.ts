import { IScheduleTask, ScheduleTaskInitParams } from './IScheduleTask';

abstract class AbstractScheduleTask<OptionalScheduleTaskInitParams>
  implements IScheduleTask<OptionalScheduleTaskInitParams>
{
  protected _dayjs!: any;

  public abstract execute(): Promise<void>;

  public init = async (
    initParams: ScheduleTaskInitParams<OptionalScheduleTaskInitParams>
  ): Promise<this> => {
    const { dayjs, ...optionalScheduleTaskInitParams } = initParams;
    this._dayjs = dayjs;
    await this._initTemplate(optionalScheduleTaskInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalScheduleTaskInitParams: Omit<
      ScheduleTaskInitParams<OptionalScheduleTaskInitParams>,
      'dayjs'
    >
  ): Promise<void> => {
    return;
  };
}

export { AbstractScheduleTask };
