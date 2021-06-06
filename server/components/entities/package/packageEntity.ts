import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

class PackageEntity extends AbstractEntity implements IEntity {
  build(entityData: {
    hostedBy: string;
    priceDetails?: { hourlyPrice: string; currency: string };
    lessonAmount: number;
    isOffering?: boolean;
    packageType: string;
    packageDurations?: number[];
  }): any {
    const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } =
      entityData;
    return Object.freeze({
      hostedBy,
      priceDetails: priceDetails || {
        currency: 'SGD',
        hourlyPrice: '30.00',
      },
      lessonAmount,
      isOffering: isOffering || true,
      packageType,
      packageDurations: packageDurations || [30, 60],
    });
  }
}

export { PackageEntity };
