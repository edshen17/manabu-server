import { IUsecase } from '../abstractions/IUsecase';

class GetUserUsecase implements IUsecase {
  private userDbService: any;
  constructor(userDbService: any) {
    this.userDbService = userDbService;
  }

  public build = async (controllerData: any): Promise<{} | undefined> => {
    if (controllerData.uId || controllerData.currentAPIUser.userId) {
      const idToSearch =
        controllerData.endpointPath == '/me'
          ? controllerData.currentAPIUser.userId
          : controllerData.uId;
      const user = await this.userDbService.findById(idToSearch, controllerData.currentAPIUser);
      return user;
    }
  };
}

export { GetUserUsecase };
