import { AppointmentDoc } from '../../../../models/Appointment';
import { StringKeyObject } from '../../../../types/custom';
import { LocationDataHandler } from '../../../entities/utils/locationDataHandler/locationDataHandler';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
import { DbServiceAccessOptions, DbServiceModelViews } from '../../abstractions/IDbService';
import { PackageTransactionDbService } from '../packageTransaction/packageTransactionDbService';
import { UserDbService } from '../user/userDbService';
declare type OptionalAppointmentDbServiceInitParams = {
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
    makeUserDbService: Promise<UserDbService>;
    makeLocationDataHandler: LocationDataHandler;
};
declare type AppointmentDbServiceResponse = AppointmentDoc;
declare class AppointmentDbService extends AbstractDbService<OptionalAppointmentDbServiceInitParams, AppointmentDbServiceResponse> {
    private _packageTransactionDbService;
    private _userDbService;
    private _locationDataHandler;
    protected _getDbServiceModelViews: () => DbServiceModelViews;
    protected _getComputedProps: (props: {
        dbDoc: AppointmentDoc;
        dbServiceAccessOptions: DbServiceAccessOptions;
    }) => Promise<StringKeyObject>;
    private _getLocationData;
    protected _initTemplate: (optionalDbServiceInitParams: OptionalAppointmentDbServiceInitParams) => Promise<void>;
}
export { AppointmentDbService, AppointmentDbServiceResponse };
