import { JoinedUserDoc } from '../../dataAccess/services/usersDb';
import { IHttpRequest } from '../../expressCallback';
import { makePutUserController } from '../user/index';

const updateUser = async (updatingDbUser: JoinedUserDoc, currentAPIDbUser: JoinedUserDoc) => {
  const putUserController = await makePutUserController;
  const httpRequest: IHttpRequest = {
    body: {
      name: 'new name',
    },
    path: `/user/${updatingDbUser._id}/updateProfile`,
    query: {},
    params: {
      uId: updatingDbUser._id,
    },
    currentAPIUser: {
      userId: currentAPIDbUser._id,
      role: currentAPIDbUser.role,
      isVerified: true,
    },
  };
  return await putUserController.makeRequest(httpRequest);
};

export { updateUser };
