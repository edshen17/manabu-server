import { IEntity } from '../abstractions/IEntity';

class MinuteBankEntity implements IEntity {
  build(minuteBankData: any): any {
    const { hostedBy, reservedBy, minuteBank } = minuteBankData;
    return Object.freeze({
      hostedBy,
      reservedBy,
      minuteBank,
    });
  }
}

export { MinuteBankEntity };
