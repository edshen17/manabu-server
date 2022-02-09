declare type ScheduleTaskInitParams<OptionalScheduleTaskInitParams> = RequiredScheduleTaskInitParams & OptionalScheduleTaskInitParams;
declare type RequiredScheduleTaskInitParams = {
    dayjs: any;
};
interface IScheduleTask<OptionalSchedulerInitParams, ScheduleTaskResponse> {
    init: (initParams: ScheduleTaskInitParams<OptionalSchedulerInitParams>) => Promise<this>;
    execute: () => Promise<ScheduleTaskResponse>;
}
export { IScheduleTask, ScheduleTaskInitParams };
