import chai from 'chai';
import jwt from 'jsonwebtoken';
import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { userUsecaseService } from './index';
const expect = chai.expect;

// currentAPIUser: CurrentAPIUser;
//   endpointPath: string;
//   routeData: { params: any; body: any };
// userId: string;
// role: string;
// isVerified: boolean;

context('makeRequest', async () => {
  const getUserUsecase = await (await userUsecaseService).getUsecase;
  const postUserUsecase = await (await userUsecaseService).postUsecase;
  describe("given a valid user id, should return the correct user object based on requesting user's permissions", () => {
    it('admin should see restricted properties', async () => {
      const currentAPIUser: CurrentAPIUser = {
        userId: undefined,
        role: undefined,
        isVerified: true,
      };
      const controllerData: ControllerData = {
        currentAPIUser,
        routeData: { params: {}, body: { email: 'test', name: 'test', password: 'test' } },
      };
      const authToken: any = await postUserUsecase.makeRequest(controllerData);
      const secret: any = process.env.JWT_SECRET;
      const decoded: any = jwt.verify(authToken, secret);
      currentAPIUser.userId = decoded.id;
      controllerData.routeData.params.uId = decoded.id;
      currentAPIUser.role = 'user';

      const test = await getUserUsecase.makeRequest({
        currentAPIUser,
        routeData: { params: { uId: decoded.id }, body: {} },
        endpointPath: undefined,
      });
      console.log(test, 'out');
    });

    it('user (not self) should see default properties', () => {});

    it('user (self) should see extra properties as well as default properties', () => {
      // requesting /me
      // requesting id
    });
  });
});
