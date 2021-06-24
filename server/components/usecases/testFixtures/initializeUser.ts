import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { GetUserUsecase, GetUserUsecaseResponse } from '../user/getUserUsecase';
import { CreateUserUsecase } from '../user/createUserUsecase/createUserUsecase';

const initializeUser = async (props: {
  viewingAsRole: string;
  isSelf: boolean;
  controllerData: ControllerData;
  getUserUsecase: GetUserUsecase;
  createUserUsecase: CreateUserUsecase;
  isTeacherApp?: boolean;
}): Promise<GetUserUsecaseResponse> => {
  const { viewingAsRole, isSelf, controllerData, getUserUsecase, createUserUsecase, isTeacherApp } =
    props;
  const { routeData } = controllerData;
  if (isTeacherApp) {
    routeData.body.isTeacherApp = true;
  }
  const userRes: any = await createUserUsecase.makeRequest(controllerData);
  const savedDbUser = userRes.user;
  const currentAPIUser: CurrentAPIUser = {
    userId: savedDbUser._id,
    role: viewingAsRole,
  };
  const getRouteData = { params: { uId: savedDbUser._id }, body: { isTeacherApp: false } };

  if (!isSelf) {
    currentAPIUser.userId = undefined;
  }

  const newUserRes = await getUserUsecase.makeRequest({
    currentAPIUser,
    routeData: getRouteData,
    endpointPath: controllerData.endpointPath,
  });
  return newUserRes;
};

export { initializeUser };
