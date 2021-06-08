import { IHttpRequest } from '../../expressCallback';
import { makeGetUserController } from '../user';

const getUser = async (savedDbUser: any, viewingUser: any) => {
  const isSelf = savedDbUser._id == viewingUser._id;
  const getUserController = await makeGetUserController;
  const paramId = isSelf ? viewingUser._id : savedDbUser._id;
  const path = isSelf ? '/me' : `/user/${savedDbUser._id}`;
  const httpRequest: IHttpRequest = {
    body: {},
    path,
    query: {},
    params: {
      uId: paramId,
    },
    currentAPIUser: {
      userId: viewingUser._id,
      role: 'user',
      isVerified: false,
    },
  };
  return await getUserController.makeRequest(httpRequest);
};

export { getUser };
