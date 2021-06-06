import { UserDbService } from '../../dataAccess/services/usersDb';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

class MinuteBankEntity extends AbstractEntity implements IEntity {
  private userDbService!: UserDbService;
  public build = async (entityData: {
    hostedBy?: string;
    reservedBy: string;
    minuteBank?: number;
  }): Promise<any> => {
    const { hostedBy, reservedBy, minuteBank } = entityData;
    return Object.freeze({
      hostedBy,
      reservedBy,
      minuteBank: minuteBank || 0,
      hostedByData: (await this._getDbDataById(this.userDbService, hostedBy)) || {},
      reservedByData: (await this._getDbDataById(this.userDbService, reservedBy)) || {},
      lastUpdated: new Date(),
    });
  };

  public init = async (props: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    const { makeUserDbService } = props;
    this.userDbService = await makeUserDbService;
    return this;
  };
}

export { MinuteBankEntity };
