import { CronJob } from 'cron';
import { IScheduler, SchedulerInitParams } from './IScheduler';

abstract class AbstractScheduler<OptionalSchedulerInitParams>
  implements IScheduler<OptionalSchedulerInitParams>
{
  protected _cron!: any;
  protected _cronJobs: CronJob[] = [];

  public abstract start(): Promise<void>;

  public stop = async (): Promise<void> => {
    for (const cronJob of this._cronJobs) {
      cronJob.stop();
    }
  };

  public init = async (
    initParams: SchedulerInitParams<OptionalSchedulerInitParams>
  ): Promise<this> => {
    const { cron, ...optionalSchedulerInitParams } = initParams;
    this._cron = cron;
    await this._initTemplate(optionalSchedulerInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalSchedulerInitParams: Omit<SchedulerInitParams<OptionalSchedulerInitParams>, 'cron'>
  ): Promise<void> => {
    return;
  };
}

export { AbstractScheduler };
