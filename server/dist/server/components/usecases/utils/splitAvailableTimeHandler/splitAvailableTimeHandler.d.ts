import dayjs from 'dayjs';
import { AppointmentDoc } from '../../../../models/Appointment';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AvailableTimeEntity } from '../../../entities/availableTime/availableTimeEntity';
declare class SplitAvailableTimeHandler {
    private _availableTimeDbService;
    private _availableTimeEntity;
    private _dayjs;
    split: (appointments: AppointmentDoc[]) => Promise<void>;
    private _splitAvailableTime;
    private _updateAvailableTime;
    private _isSameDate;
    init: (props: {
        makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
        makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
        dayjs: typeof dayjs;
    }) => Promise<this>;
}
export { SplitAvailableTimeHandler };
