"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMinuteBankUsecase = void 0;
class GetMinuteBankUsecase {
    constructor() {
        this.init = async (services) => {
            this.minuteBankDbService = await services.makeUserDbService;
            return this;
        };
        this.makeRequest = async (controllerData) => {
            const { routeData, currentAPIUser } = controllerData;
            const { params } = routeData;
            const { hostedBy, reservedBy } = params;
            const isSelf = hostedBy == currentAPIUser.userId || reservedBy == currentAPIUser.userId;
            const isCurrentAPIUserPermitted = isSelf || currentAPIUser.role == 'admin';
            const currentAPIUserRole = currentAPIUser.role || 'user';
            const accessOptions = {
                isProtectedResource: true,
                isCurrentAPIUserPermitted,
                currentAPIUserRole,
                isSelf,
            };
            const searchQuery = { hostedBy, reservedBy };
            const minuteBank = await this.minuteBankDbService.findOne({
                searchQuery,
                accessOptions,
            });
            return minuteBank;
        };
    }
}
exports.GetMinuteBankUsecase = GetMinuteBankUsecase;
