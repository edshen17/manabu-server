import { CronJob } from 'cron';
import { IScheduler, SchedulerInitParams } from './IScheduler';
declare abstract class AbstractScheduler<OptionalSchedulerInitParams> implements IScheduler<OptionalSchedulerInitParams> {
    protected _cron: any;
    protected _cronJobs: CronJob[];
    abstract start(): Promise<void>;
    stop: () => Promise<void>;
    init: (initParams: SchedulerInitParams<OptionalSchedulerInitParams>) => Promise<this>;
    protected _initTemplate: (optionalSchedulerInitParams: Omit<SchedulerInitParams<OptionalSchedulerInitParams>, 'cron'>) => Promise<void>;
}
export { AbstractScheduler };
