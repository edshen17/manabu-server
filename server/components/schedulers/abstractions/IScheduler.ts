type SchedulerInitParams<OptionalSchedulerInitParams> = RequiredSchedulerInitParams &
  OptionalSchedulerInitParams;

type RequiredSchedulerInitParams = {
  cron: any;
};

interface IScheduler<OptionalSchedulerInitParams> {
  init: (initParams: SchedulerInitParams<OptionalSchedulerInitParams>) => Promise<this>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
}

export { IScheduler, SchedulerInitParams };
