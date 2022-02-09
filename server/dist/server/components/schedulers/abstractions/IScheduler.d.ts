declare type SchedulerInitParams<OptionalSchedulerInitParams> = RequiredSchedulerInitParams & OptionalSchedulerInitParams;
declare type RequiredSchedulerInitParams = {
    cron: any;
};
interface IScheduler<OptionalSchedulerInitParams> {
    init: (initParams: SchedulerInitParams<OptionalSchedulerInitParams>) => Promise<this>;
    start: () => Promise<void>;
    stop: () => Promise<void>;
}
export { IScheduler, SchedulerInitParams };
