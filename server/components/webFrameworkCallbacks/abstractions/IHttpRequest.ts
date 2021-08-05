import { Request } from 'express';
import { ObjectId } from 'mongoose';
interface IHttpRequest {
  body: Request['body'];
  path: Request['path'];
  query: Request['query'];
  params: Request['params'];
  currentAPIUser: CurrentAPIUser;
}

type CurrentAPIUser = {
  userId?: ObjectId | string;
  teacherId?: ObjectId | string;
  role: string;
};

export { IHttpRequest, CurrentAPIUser };
