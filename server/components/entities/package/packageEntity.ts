import { UserDbService } from '../../dataAccess/services/usersDb';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

class PackageEntity extends AbstractEntity implements IEntity {
  private userDbService!: UserDbService;

  private _getPriceDetails = async (hostedBy: string) => {
    const savedDbTeacher = await this.getDbDataById(this.userDbService, hostedBy);
    return savedDbTeacher.teacherData.hourlyRate;
  };

  public build = async (entityData: {
    hostedBy: string;
    priceDetails?: { hourlyPrice: string; currency: string };
    lessonAmount: number;
    isOffering?: boolean;
    packageType: string;
    packageDurations?: number[];
  }): Promise<any> => {
    const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } =
      entityData;
    return Object.freeze({
      hostedBy,
      priceDetails: priceDetails || (await this._getPriceDetails(hostedBy)) || {},
      lessonAmount,
      isOffering: isOffering || true,
      packageType,
      packageDurations: packageDurations || [30, 60],
    });
  };

  public init = async (props: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    const { makeUserDbService } = props;
    this.userDbService = await makeUserDbService;
    return this;
  };
}

export { PackageEntity };
