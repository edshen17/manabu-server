import jwt from 'jsonwebtoken';
import { JoinedUserDoc } from '../../dataAccess/services/usersDb';
import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { GetUserUsecase, GetUserUsecaseResponse } from '../user/getUserUsecase';
import { PostUserUsecase } from '../user/postUserUsecase';

const initializeUser = async (props: {
  viewingAs: string;
  isSelf: boolean;
  controllerData: ControllerData;
  getUserUsecase: GetUserUsecase;
  postUserUsecase: PostUserUsecase;
}): Promise<GetUserUsecaseResponse> => {
  const authToken: any = await props.postUserUsecase.makeRequest(props.controllerData);
  const secret: any = process.env.JWT_SECRET;
  const decoded: any = jwt.verify(authToken.token, secret);
  const currentAPIUser: CurrentAPIUser = {
    userId: decoded._id,
    role: props.viewingAs,
    isVerified: true,
  };
  const routeData = { params: { uId: decoded._id }, body: {} };
  if (!props.isSelf) {
    currentAPIUser.userId = undefined;
  }

  const newUser = await props.getUserUsecase.makeRequest({
    currentAPIUser,
    routeData,
    endpointPath: props.controllerData.endpointPath,
  });
  return newUser;
};

export { initializeUser };
