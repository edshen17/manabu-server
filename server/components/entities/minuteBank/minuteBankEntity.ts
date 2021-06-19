import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type MinuteBankEntityData = {
  hostedBy: string;
  reservedBy: string;
  minuteBank?: number;
};

type MinuteBankEntityResponse = {
  hostedBy: string;
  reservedBy: string;
  minuteBank: number;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
  lastUpdated: Date;
};

class MinuteBankEntity
  extends AbstractEntity<MinuteBankEntityResponse>
  implements IEntity<MinuteBankEntityResponse>
{
  private userDbService!: UserDbService;
  public build = async (
    minuteBankData: MinuteBankEntityData
  ): Promise<MinuteBankEntityResponse> => {
    const minuteBank = this._buildMinuteBankEntity(minuteBankData);
    return minuteBank;
  };

  private _buildMinuteBankEntity = async (
    minuteBankData: MinuteBankEntityData
  ): Promise<MinuteBankEntityResponse> => {
    const { hostedBy, reservedBy, minuteBank } = minuteBankData;
    return Object.freeze({
      hostedBy,
      reservedBy,
      minuteBank: minuteBank || 0,
      hostedByData: (await this.getDbDataById(this.userDbService, hostedBy)) || {},
      reservedByData: (await this.getDbDataById(this.userDbService, reservedBy)) || {},
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
