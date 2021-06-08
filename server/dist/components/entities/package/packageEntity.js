"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class PackageEntity extends AbstractEntity_1.AbstractEntity {
    build(entityData) {
        const { hostedBy, priceDetails, lessonAmount, isOffering, packageType, packageDurations } = entityData;
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
exports.PackageEntity = PackageEntity;
