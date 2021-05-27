import { StatusCodes } from 'http-status-codes';
import { IHttpRequest } from '../../expressCallback/index';
import { IControllerResponse } from '../../controllers/index';

// export const makeGetUserController = ({ getUserUsecase }: { getUserUsecase: IGetUser }) => {

// }

// function makeGetUserController({ getUserUsecase }) {
//   return async function getUser(httpRequest) {
//     const headers = {
//       'Content-Type': 'application/json',
//     };
//     try {
//       const users = await getUserUsecase({
//         uId: httpRequest.params.uId,
//         currentAPIUser: httpRequest.currentAPIUser,
//         path: httpRequest.path,
//       });
//       return {
//         headers,
//         statusCode: StatusCodes.OK,
//         body: users,
//       };
//     } catch (e) {
//       // TODO: Error logging
//       console.log(e);
//       return {
//         headers,
//         statusCode: 404,
//         body: {
//           error: e.message,
//         },
//       };
//     }
//   };
// }

// module.exports = { makeGetUserController };
