import { IScheduler, SchedulerInitParams } from './IScheduler';

abstract class AbstractScheduler<OptionalSchedulerInitParams>
  implements IScheduler<OptionalSchedulerInitParams>
{
  public abstract start(): Promise<void>;

  public init = async (
    initParams: SchedulerInitParams<OptionalSchedulerInitParams>
  ): Promise<this> => {
    const { ...optionalSchedulerInitParams } = initParams;
    await this._initTemplate(optionalSchedulerInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalSchedulerInitParams: Omit<SchedulerInitParams<OptionalSchedulerInitParams>, ''>
  ): Promise<void> => {
    return;
  };
}

export { AbstractScheduler };
