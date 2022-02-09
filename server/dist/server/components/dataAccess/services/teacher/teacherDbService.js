"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherDbService = void 0;
const AbstractEmbeddedDbService_1 = require("../../abstractions/AbstractEmbeddedDbService");
class TeacherDbService extends AbstractEmbeddedDbService_1.AbstractEmbeddedDbService {
    _initTemplate = async (optionalDbServiceInitParams) => {
        const { makeParentDbService, deepEqual } = optionalDbServiceInitParams;
        this._parentDbService = await makeParentDbService;
        this._deepEqual = deepEqual;
        this._embeddedFieldData = {
            parentFieldName: 'teacherData',
            childFieldName: 'packages',
            embedType: AbstractEmbeddedDbService_1.DB_SERVICE_EMBED_TYPE.SINGLE,
        };
    };
}
exports.TeacherDbService = TeacherDbService;
