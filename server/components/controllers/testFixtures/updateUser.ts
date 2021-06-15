import { JoinedUserDoc } from '../../dataAccess/services/usersDb';
import { IHttpRequest } from '../../expressCallback/abstractions/IHttpRequest';
import { makePutEditUserController } from '../user/index';

const updateUser = async (
  updatingDbUser: JoinedUserDoc,
  currentAPIDbUser: JoinedUserDoc,
  body: any
) => {
  const putEditUserController = await makePutEditUserController;
  const httpRequest: IHttpRequest = {
    body,
    path: `/user/${updatingDbUser._id}/updateProfile`,
    query: {},
    params: {
      uId: updatingDbUser._id,
    },
    currentAPIUser: {
      userId: currentAPIDbUser._id,
      role: currentAPIDbUser.role,
    },
  };
  return await putEditUserController.makeRequest(httpRequest);
};

export { updateUser };
