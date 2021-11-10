type ScheduleTaskInitParams<OptionalScheduleTaskInitParams> = RequiredScheduleTaskInitParams &
  OptionalScheduleTaskInitParams;

type RequiredScheduleTaskInitParams = {
  dayjs: any;
};

interface IScheduleTask<OptionalSchedulerInitParams> {
  init: (initParams: ScheduleTaskInitParams<OptionalSchedulerInitParams>) => Promise<this>;
  execute: () => Promise<void>;
}

export { IScheduleTask, ScheduleTaskInitParams };
