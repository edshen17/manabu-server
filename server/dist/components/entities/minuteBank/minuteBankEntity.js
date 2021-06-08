"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinuteBankEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class MinuteBankEntity extends AbstractEntity_1.AbstractEntity {
    constructor() {
        super(...arguments);
        this.build = async (entityData) => {
            const { hostedBy, reservedBy, minuteBank } = entityData;
            return Object.freeze({
                hostedBy,
                reservedBy,
                minuteBank: minuteBank || 0,
                hostedByData: (await this.getDbDataById(this.userDbService, hostedBy)) || {},
                reservedByData: (await this.getDbDataById(this.userDbService, reservedBy)) || {},
                lastUpdated: new Date(),
            });
        };
        this.init = async (props) => {
            const { makeUserDbService } = props;
            this.userDbService = await makeUserDbService;
            return this;
        };
    }
}
exports.MinuteBankEntity = MinuteBankEntity;
