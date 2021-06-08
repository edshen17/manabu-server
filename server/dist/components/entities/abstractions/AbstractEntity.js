"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEntity = void 0;
class AbstractEntity {
    constructor() {
        this.defaultAccessOptions = {
            isProtectedResource: false,
            isCurrentAPIUserPermitted: true,
            isSelf: false,
            currentAPIUserRole: 'user',
        };
        this.getDbDataById = async (dbService, _id) => {
            const accessOptions = this.defaultAccessOptions;
            const dbData = await dbService.findById({ _id, accessOptions });
            return dbData;
        };
    }
}
exports.AbstractEntity = AbstractEntity;
