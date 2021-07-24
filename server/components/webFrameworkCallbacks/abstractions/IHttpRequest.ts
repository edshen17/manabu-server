import { Request } from 'express';
interface IHttpRequest {
  body: Request['body'];
  path: Request['path'];
  query: Request['query'];
  params: Request['params'];
  currentAPIUser: CurrentAPIUser;
}

type CurrentAPIUser = {
  userId?: string;
  teacherId?: string;
  role: string;
};

export { IHttpRequest, CurrentAPIUser };
