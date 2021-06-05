import { IEntity } from '../abstractions/IEntity';

class MinuteBankEntity implements IEntity {
  build(minuteBankData: { hostedBy: any; reservedBy: any; minuteBank?: any }): any {
    const { hostedBy, reservedBy, minuteBank } = minuteBankData;
    return Object.freeze({
      hostedBy,
      reservedBy,
      minuteBank: minuteBank || 0,
    });
  }
}

export { MinuteBankEntity };
