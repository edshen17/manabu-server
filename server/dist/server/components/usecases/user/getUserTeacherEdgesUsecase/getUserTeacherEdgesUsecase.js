"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserTeacherEdgesUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetUserTeacherEdgesUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _graphDbService;
    _isProtectedResource = () => {
        return true;
    };
    _makeRequestTemplate = async (props) => {
        const { dbServiceAccessOptions } = props;
        const { graphQuery, limit } = await this._getGraphQuery(props);
        const res = await this._graphDbService.graphQuery({
            query: graphQuery,
            dbServiceAccessOptions,
        });
        const promiseArr = [];
        let count = 0;
        while (res.hasNext()) {
            const record = res.next();
            const values = record.values();
            for (const value of values) {
                const user = value.properties;
                if (user) {
                    const promise = this._dbService.findById({
                        _id: user._id,
                        dbServiceAccessOptions: this._dbService.getBaseDbServiceAccessOptions(),
                    });
                    promiseArr.push(promise);
                }
                else {
                    count = value;
                }
            }
        }
        const users = await Promise.all(promiseArr);
        const pages = Math.ceil(count / limit) - 1;
        return { users, pages };
    };
    _getGraphQuery = async (props) => {
        const { currentAPIUser, endpointPath, params, query } = props;
        const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
        const _id = isSelf ? currentAPIUser.userId : params.userId;
        const isTeacher = ['teacher', 'admin'].includes(currentAPIUser.role);
        const { page, limit } = this._getProcessedQuery(query);
        const intermediateGraphQuery = isTeacher
            ? `MATCH (teacher:User { _id: "${_id}"  })-[teaches:teaches]->(students:User) RETURN students, count(*) ORDER BY teaches.since`
            : `MATCH (student:User { _id: "${_id}"  })<-[teaches:teaches]-(teachers:User) RETURN teachers, count(*) ORDER BY teaches.since`;
        const graphQuery = `${intermediateGraphQuery} SKIP ${page} LIMIT ${limit}`;
        return { graphQuery, limit, page };
    };
    _getProcessedQuery = (query) => {
        const { page, limit } = query;
        const processedQuery = {
            page: page || 0,
            limit: limit || 5,
        };
        return processedQuery;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeGraphDbService } = optionalInitParams;
        this._graphDbService = await makeGraphDbService;
    };
}
exports.GetUserTeacherEdgesUsecase = GetUserTeacherEdgesUsecase;
