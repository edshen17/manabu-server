import jwt from 'jsonwebtoken';
import { JoinedUserDoc } from '../../dataAccess/services/usersDb';
import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { GetUserUsecase, GetUserUsecaseResponse } from '../user/getUserUsecase';
import { CreateUserUsecase } from '../user/createUserUsecase';

const initializeUser = async (props: {
  viewingAs: string;
  isSelf: boolean;
  controllerData: ControllerData;
  getUserUsecase: GetUserUsecase;
  createUserUsecase: CreateUserUsecase;
  isTeacherApp?: boolean;
}): Promise<GetUserUsecaseResponse> => {
  const { viewingAs, isSelf, controllerData, getUserUsecase, createUserUsecase, isTeacherApp } =
    props;
  const { routeData } = controllerData;
  if (isTeacherApp) {
    routeData.body.isTeacherApp = true;
  }
  const authToken: any = await createUserUsecase.makeRequest(controllerData);
  const secret: any = process.env.JWT_SECRET;
  const decoded: any = jwt.verify(authToken.token, secret);
  const currentAPIUser: CurrentAPIUser = {
    userId: decoded._id,
    role: viewingAs,
  };
  const getRouteData = { params: { uId: decoded._id }, body: { isTeacherApp: false } };

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
