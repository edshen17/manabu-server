import jwt from 'jsonwebtoken';
import { JoinedUserDoc } from '../../dataAccess/services/usersDb';
import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { GetUserUsecase } from '../user/getUserUsecase';
import { PostUserUsecase } from '../user/postUserUsecase';

const initializeUser = async (props: {
  viewingAs: string | undefined;
  endpointPath: string | undefined;
  isSelf: boolean;
  controllerData: ControllerData;
  getUserUsecase: GetUserUsecase;
  postUserUsecase: PostUserUsecase;
}): Promise<JoinedUserDoc | undefined> => {
  const authToken: any = await props.postUserUsecase.makeRequest(props.controllerData);
  const secret: any = process.env.JWT_SECRET;
  const decoded: any = jwt.verify(authToken, secret);
  const currentAPIUser: CurrentAPIUser = {
    userId: decoded.id,
    role: props.viewingAs,
    isVerified: true,
  };
  const routeData = { params: { uId: decoded.id }, body: {} };
  if (!props.isSelf) {
    currentAPIUser.userId = undefined;
  }

  const newUser = await props.getUserUsecase.makeRequest({
    currentAPIUser,
    routeData,
    endpointPath: props.endpointPath,
  });
  return newUser;
};

export { initializeUser };
