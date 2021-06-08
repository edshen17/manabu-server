"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class PackageTransactionEntity extends AbstractEntity_1.AbstractEntity {
    constructor(props) {
        super();
        this.build = async (entityData) => {
            const { hostedBy, reservedBy, packageId, reservationLength, terminationDate, transactionDetails, remainingAppointments, lessonLanguage, isSubscription, methodData, } = entityData;
            return Object.freeze({
                hostedBy,
                reservedBy,
                packageId,
                transactionDate: new Date(),
                reservationLength,
                transactionDetails,
                terminationDate: terminationDate || this.dayjs().add(1, 'month').toDate(),
                isTerminated: false,
                remainingAppointments,
                remainingReschedules: 5,
                lessonLanguage: lessonLanguage || 'ja',
                isSubscription: isSubscription || false,
                methodData: methodData || {},
                packageData: (await this.getDbDataById(this.packageDbService, packageId)) || {},
                hostedByData: (await this.getDbDataById(this.userDbService, hostedBy)) || {},
                reservedByData: (await this.getDbDataById(this.userDbService, reservedBy)) || {},
            });
        };
        this.init = async (props) => {
            const { makeUserDbService, makePackageDbService } = props;
            this.userDbService = await makeUserDbService;
            this.packageDbService = await makePackageDbService;
            return this;
        };
        const { dayjs } = props;
        this.dayjs = dayjs;
    }
}
exports.PackageTransactionEntity = PackageTransactionEntity;
