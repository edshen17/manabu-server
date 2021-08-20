import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { UserContactMethod } from '../../user/userEntity';

type LocationData =
  | {
      locationName: string;
      locationType: string;
      matchedContactMethod: MatchedContactMethod;
    }
  | StringKeyObject;

type MatchedContactMethod = {
  hostedByContactMethod: UserContactMethod;
  reservedByContactMethod: UserContactMethod;
};

class LocationDataHandler {
  public getLocationData = (props: {
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
  }): LocationData => {
    const hasLocationData = this._hasLocationData(props);
    if (!hasLocationData) {
      return {};
    }
    const matchedContactMethod = this._getMatchedContactMethod(props);
    const { hostedByContactMethod, reservedByContactMethod } = matchedContactMethod;
    const isOnline =
      hostedByContactMethod.methodType == 'online' &&
      reservedByContactMethod.methodType == 'online';
    const locationData = <LocationData>{
      matchedContactMethod,
      locationType: isOnline ? 'online' : 'offline',
    };
    if (hostedByContactMethod.methodName == reservedByContactMethod.methodName) {
      locationData.locationName = hostedByContactMethod.methodName;
    } else {
      locationData.locationName = 'alternative';
    }
    return locationData;
  };

  private _hasLocationData = (props: {
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
  }) => {
    const { hostedByData, reservedByData } = props;
    const hasLocationData =
      hostedByData &&
      reservedByData &&
      hostedByData.contactMethods &&
      reservedByData.contactMethods;
    return hasLocationData;
  };

  private _getMatchedContactMethod = (props: {
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
  }): MatchedContactMethod => {
    const { hostedByData, reservedByData } = props;
    const matchedContactMethod = <MatchedContactMethod>{
      hostedByContactMethod: {},
      reservedByContactMethod: {},
    };
    const hostedByContactMethods = this._sortByPrimaryContactMethod(hostedByData.contactMethods);
    const reservedByContactMethods = this._sortByPrimaryContactMethod(
      reservedByData.contactMethods
    );
    hostedByContactMethods.forEach((hostedByContactMethod) => {
      reservedByContactMethods.forEach((reservedByContactMethod) => {
        const isSharedContactMethod =
          hostedByContactMethod.methodName == reservedByContactMethod.methodName;
        if (isSharedContactMethod) {
          matchedContactMethod.hostedByContactMethod = hostedByContactMethod;
          matchedContactMethod.reservedByContactMethod = reservedByContactMethod;
          return;
        } else {
          matchedContactMethod.hostedByContactMethod = hostedByContactMethods[0];
          matchedContactMethod.reservedByContactMethod = reservedByContactMethods[0];
        }
      });
    });
    return matchedContactMethod;
  };

  private _sortByPrimaryContactMethod = (contactMethods: UserContactMethod[]) => {
    const sortedByPrimaryContactMethod = contactMethods.sort((a, b) => {
      let aPrefOrder = a.isPrimaryMethod ? 1 : 0;
      let bPrefOrder = b.isPrimaryMethod ? 1 : 0;
      return aPrefOrder - bPrefOrder;
    });
    return sortedByPrimaryContactMethod;
  };
}

export { LocationDataHandler, LocationData };
