import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type MinuteBankEntityParams = {
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
  private _userDbService!: UserDbService;

  public build = async (
    minuteBankData: MinuteBankEntityParams
  ): Promise<MinuteBankEntityResponse> => {
    const minuteBank = this._buildMinuteBankEntity(minuteBankData);
    return minuteBank;
  };

  private _buildMinuteBankEntity = async (
    minuteBankData: MinuteBankEntityParams
  ): Promise<MinuteBankEntityResponse> => {
    const { hostedBy, reservedBy, minuteBank } = minuteBankData;
    return Object.freeze({
      hostedBy,
      reservedBy,
      minuteBank: minuteBank || 0,
      hostedByData:
        (await this.getDbDataById({ dbService: this._userDbService, _id: hostedBy })) || {},
      reservedByData:
        (await this.getDbDataById({ dbService: this._userDbService, _id: reservedBy })) || {},
      lastUpdated: new Date(),
    });
  };

  public init = async (props: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    const { makeUserDbService } = props;
    this._userDbService = await makeUserDbService;
    return this;
  };
}

export { MinuteBankEntity, MinuteBankEntityParams, MinuteBankEntityResponse };
