import { IUsecase } from '../abstractions/IUsecase';

class PutUserUsecase implements IUsecase {
  private userDbService: any;
  constructor(userDbService: any) {
    this.userDbService = userDbService;
  }

  public build = async (controllerData: any): Promise<{} | undefined> => {
    // if (uId || currentAPIUser.userId) {
    //   const idToSearch = endpointPath == '/me' ? currentAPIUser.userId : uId;
    //   const user = await this.userDbService.update(idToSearch, currentAPIUser);
    //   return user;
    // }
    return undefined;
  };
}

export { PutUserUsecase };
