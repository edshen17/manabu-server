import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { UserContactMethod } from '../../user/userEntity';

type LocationData =
  | {
      name: string;
      type: string;
      hostedByContactMethod: UserContactMethod;
      reservedByContactMethod: UserContactMethod;
    }
  | StringKeyObject;

type GetUserContactMethodsResponse = {
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
    const { hostedByContactMethod, reservedByContactMethod } = this._getUserContactMethods(props);
    const isOnline =
      hostedByContactMethod.type == 'online' && reservedByContactMethod.type == 'online';
    const locationData = <LocationData>{
      hostedByContactMethod,
      reservedByContactMethod,
      locationType: isOnline ? 'online' : 'offline',
    };
    if (hostedByContactMethod.name == reservedByContactMethod.name) {
      locationData.name = hostedByContactMethod.name;
    } else {
      locationData.name = 'alternative';
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

  private _getUserContactMethods = (props: {
    hostedByData: JoinedUserDoc;
    reservedByData: JoinedUserDoc;
  }): GetUserContactMethodsResponse => {
    const { hostedByData, reservedByData } = props;
    const hostedByContactMethods = this._sortByPrimaryContactMethod(hostedByData.contactMethods);
    const reservedByContactMethods = this._sortByPrimaryContactMethod(
      reservedByData.contactMethods
    );
    const userContactMethods = {} as GetUserContactMethodsResponse;
    hostedByContactMethods.forEach((hostedByContactMethod) => {
      reservedByContactMethods.forEach((reservedByContactMethod) => {
        const isSharedContactMethod = hostedByContactMethod.name == reservedByContactMethod.name;
        if (isSharedContactMethod) {
          userContactMethods.hostedByContactMethod = hostedByContactMethod;
          userContactMethods.reservedByContactMethod = reservedByContactMethod;
          return;
        } else {
          userContactMethods.hostedByContactMethod = hostedByContactMethods[0];
          userContactMethods.reservedByContactMethod = reservedByContactMethods[0];
        }
      });
    });
    return userContactMethods;
  };

  private _sortByPrimaryContactMethod = (contactMethods: UserContactMethod[]) => {
    const sortedByPrimaryContactMethod = contactMethods.sort((a, b) => {
      const aPrefOrder = a.isPrimaryMethod ? 1 : 0;
      const bPrefOrder = b.isPrimaryMethod ? 1 : 0;
      return aPrefOrder - bPrefOrder;
    });
    return sortedByPrimaryContactMethod;
  };
}

export { LocationDataHandler, LocationData };
