import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb/usersDb';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type PackageEntityData = {
  hostedBy: string;
  priceDetails?: { hourlyPrice: number; currency: string };
  lessonAmount: number;
  isOffering?: boolean;
  packageType: string;
  packageDurations?: number[];
};

type PackageEntityResponse = {
  hostedBy: string;
  priceDetails: { hourlyPrice: number; currency: string };
  lessonAmount: number;
  isOffering: boolean;
  packageType: string;
  packageDurations: number[];
};

class PackageEntity
  extends AbstractEntity<PackageEntityResponse>
  implements IEntity<PackageEntityResponse>
{
  private userDbService!: UserDbService;

  public build = async (packageEntityData: PackageEntityData): Promise<PackageEntityResponse> => {
    const packageEntity = await this._buildPackageEntity(packageEntityData);
    return packageEntity;
  };

  private _buildPackageEntity = async (
    packageEntityData: PackageEntityData
  ): Promise<PackageEntityResponse> => {
    const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } =
      packageEntityData;
    return Object.freeze({
      hostedBy,
      priceDetails: priceDetails || (await this._getPriceDetails(hostedBy)) || {},
      lessonAmount,
      isOffering: isOffering || true,
      packageType,
      packageDurations: packageDurations || [30, 60],
    });
  };

  private _getPriceDetails = async (hostedBy: string) => {
    const savedDbTeacher: JoinedUserDoc = await this.getDbDataById(this.userDbService, hostedBy);
    const teacherHourlyRate = savedDbTeacher.teacherData.hourlyRate;
    const priceDetails = {
      currency: teacherHourlyRate.currency!,
      hourlyPrice: teacherHourlyRate.amount!,
    };
    return priceDetails;
  };

  public init = async (props: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    const { makeUserDbService } = props;
    this.userDbService = await makeUserDbService;
    return this;
  };
}

export { PackageEntity, PackageEntityResponse };
