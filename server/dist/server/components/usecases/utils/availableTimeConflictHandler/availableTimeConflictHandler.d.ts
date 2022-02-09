import { ObjectId } from 'mongoose';
import { AppointmentDbService } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
declare type TestTimeParams = {
    hostedById: ObjectId;
    availableTimeId?: ObjectId;
    startDate: Date;
    endDate: Date;
};
declare enum AVAILABLE_TIME_CONFLIT_HANDLER_ERROR {
    INVALID_DURATION = "Your timeslot duration must be divisible by 30 minutes.",
    INVALID_TIME = "Timeslots must begin at the start of the hour or 30 minutes into the hour.",
    OVERLAP = "You cannot have timeslots that overlap."
}
declare class AvailableTimeConflictHandler {
    private _availableTimeDbService;
    private _appointmentDbService;
    private _dayjs;
    testTime: (props: TestTimeParams) => Promise<void>;
    private _getTestTimeResults;
    private _isOverlapping;
    init: (initParams: {
        makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
        makeAppointmentDbService: Promise<AppointmentDbService>;
        dayjs: any;
    }) => Promise<this>;
}
export { AvailableTimeConflictHandler, AVAILABLE_TIME_CONFLIT_HANDLER_ERROR };
