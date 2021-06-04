import { IEntity } from '../abstractions/IEntity';

class PackageEntity implements IEntity {
  build(packageData: any): any {
    const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } =
      packageData;
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
