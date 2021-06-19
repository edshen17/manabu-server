import { JoinedUserDoc } from '../../dataAccess/services/user/userDbService';
import { IHttpRequest } from '../../expressCallback/abstractions/IHttpRequest';
import { makeEditUserController } from '../user/index';

const updateUser = async (
  updatingDbUser: JoinedUserDoc,
  currentAPIDbUser: JoinedUserDoc,
  body: any
) => {
  const editUserController = await makeEditUserController;
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
  return await editUserController.makeRequest(httpRequest);
};

export { updateUser };
