import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type PackageEntityParams = {
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
  private _userDbService!: UserDbService;

  public build = async (packageEntityData: PackageEntityParams): Promise<PackageEntityResponse> => {
    const packageEntity = await this._buildPackageEntity(packageEntityData);
    return packageEntity;
  };

  private _buildPackageEntity = async (
    packageEntityData: PackageEntityParams
  ): Promise<PackageEntityResponse> => {
    const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } =
      packageEntityData;
    return Object.freeze({
      hostedBy,
      priceDetails: priceDetails || (await this._getPriceDetails(hostedBy)),
      lessonAmount: lessonAmount || 5,
      isOffering: isOffering || true,
      packageType: packageType || 'light',
      packageDurations: packageDurations || [30, 60],
    });
  };

  private _getPriceDetails = async (hostedBy: string) => {
    const savedDbTeacher: JoinedUserDoc = await this.getDbDataById(this._userDbService, hostedBy);
    if (savedDbTeacher.teacherData) {
      const teacherHourlyRate = savedDbTeacher.teacherData.hourlyRate;
      const priceDetails = {
        currency: teacherHourlyRate.currency!,
        hourlyPrice: teacherHourlyRate.amount!,
      };
      return priceDetails;
    } else {
      return { hourlyPrice: 35, currency: 'SGD' };
    }
  };

  public init = async (props: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    const { makeUserDbService } = props;
    this._userDbService = await makeUserDbService;
    return this;
  };
}

export { PackageEntity, PackageEntityResponse, PackageEntityParams as PackageEntityData };
