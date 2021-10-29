import { Request } from 'express';
import { ObjectId } from 'mongoose';
interface IHttpRequest {
  body: Request['body'];
  path: Request['path'];
  query: Request['query'];
  params: Request['params'];
  headers: Request['headers'];
  currentAPIUser: CurrentAPIUser;
}

type CurrentAPIUser = {
  userId?: ObjectId;
  teacherId?: ObjectId;
  role: string;
};

export { IHttpRequest, CurrentAPIUser };
