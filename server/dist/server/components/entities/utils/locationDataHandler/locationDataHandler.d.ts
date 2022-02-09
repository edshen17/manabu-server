/// <reference types="custom" />
import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { UserContactMethod } from '../../user/userEntity';
declare type LocationData = {
    name: string;
    type: string;
    hostedByContactMethod: UserContactMethod;
    reservedByContactMethod: UserContactMethod;
} | StringKeyObject;
declare class LocationDataHandler {
    getLocationData: (props: {
        hostedByData: JoinedUserDoc;
        reservedByData: JoinedUserDoc;
    }) => LocationData;
    private _hasLocationData;
    private _getUserContactMethods;
    private _sortByPrimaryContactMethod;
}
export { LocationDataHandler, LocationData };
