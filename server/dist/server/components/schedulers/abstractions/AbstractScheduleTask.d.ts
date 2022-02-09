import { IScheduleTask, ScheduleTaskInitParams } from './IScheduleTask';
declare abstract class AbstractScheduleTask<OptionalScheduleTaskInitParams, ScheduleTaskResponse> implements IScheduleTask<OptionalScheduleTaskInitParams, ScheduleTaskResponse> {
    protected _dayjs: any;
    abstract execute(): Promise<ScheduleTaskResponse>;
    init: (initParams: ScheduleTaskInitParams<OptionalScheduleTaskInitParams>) => Promise<this>;
    protected _initTemplate: (optionalScheduleTaskInitParams: Omit<ScheduleTaskInitParams<OptionalScheduleTaskInitParams>, 'dayjs'>) => Promise<void>;
}
export { AbstractScheduleTask };
