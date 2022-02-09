"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationDataHandler = void 0;
class LocationDataHandler {
    getLocationData = (props) => {
        const hasLocationData = this._hasLocationData(props);
        if (!hasLocationData) {
            return {};
        }
        const { hostedByContactMethod, reservedByContactMethod } = this._getUserContactMethods(props);
        const isOnline = hostedByContactMethod.type == 'online' && reservedByContactMethod.type == 'online';
        const locationData = {
            hostedByContactMethod,
            reservedByContactMethod,
            locationType: isOnline ? 'online' : 'offline',
        };
        if (hostedByContactMethod.name == reservedByContactMethod.name) {
            locationData.name = hostedByContactMethod.name;
        }
        else {
            locationData.name = 'alternative';
        }
        return locationData;
    };
    _hasLocationData = (props) => {
        const { hostedByData, reservedByData } = props;
        const hasLocationData = hostedByData &&
            reservedByData &&
            hostedByData.contactMethods &&
            reservedByData.contactMethods;
        return hasLocationData;
    };
    _getUserContactMethods = (props) => {
        const { hostedByData, reservedByData } = props;
        const hostedByContactMethods = this._sortByPrimaryContactMethod(hostedByData.contactMethods);
        const reservedByContactMethods = this._sortByPrimaryContactMethod(reservedByData.contactMethods);
        const userContactMethods = {};
        hostedByContactMethods.forEach((hostedByContactMethod) => {
            reservedByContactMethods.forEach((reservedByContactMethod) => {
                const isSharedContactMethod = hostedByContactMethod.name == reservedByContactMethod.name;
                if (isSharedContactMethod) {
                    userContactMethods.hostedByContactMethod = hostedByContactMethod;
                    userContactMethods.reservedByContactMethod = reservedByContactMethod;
                    return;
                }
                else {
                    userContactMethods.hostedByContactMethod = hostedByContactMethods[0];
                    userContactMethods.reservedByContactMethod = reservedByContactMethods[0];
                }
            });
        });
        return userContactMethods;
    };
    _sortByPrimaryContactMethod = (contactMethods) => {
        const sortedByPrimaryContactMethod = contactMethods.sort((a, b) => {
            const aPrefOrder = a.isPrimaryMethod ? 1 : 0;
            const bPrefOrder = b.isPrimaryMethod ? 1 : 0;
            return aPrefOrder - bPrefOrder;
        });
        return sortedByPrimaryContactMethod;
    };
}
exports.LocationDataHandler = LocationDataHandler;
