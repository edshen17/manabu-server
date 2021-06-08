'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.GetUserUsecase = void 0;
class GetUserUsecase {
  constructor() {
    this.init = async (services) => {
      this.userDbService = await services.makeUserDbService;
      return this;
    };
    this.makeRequest = async (controllerData) => {
      const { routeData, currentAPIUser, endpointPath } = controllerData;
      const { params } = routeData;
      if (params.uId || currentAPIUser.userId) {
        const _id = endpointPath == '/me' ? currentAPIUser.userId : params.uId;
        const accessOptions = {
          isProtectedResource: false,
          isCurrentAPIUserPermitted: true,
          currentAPIUserRole: currentAPIUser.role || 'user',
          isSelf: params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId,
        };
        const user = await this.userDbService.findById({
          _id,
          accessOptions,
        });
        return user;
      }
    };
  }
}
exports.GetUserUsecase = GetUserUsecase;
