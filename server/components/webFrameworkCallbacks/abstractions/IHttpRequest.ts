import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { StringKeyObject } from '../../../types/custom';

interface IHttpRequest {
  body: Request['body'];
  path: Request['path'];
  query: Request['query'];
  params: Request['params'];
  headers: Request['headers'];
  cookies: Request['cookies'];
  rawBody: StringKeyObject;
  currentAPIUser: CurrentAPIUser;
  req: StringKeyObject;
}

type CurrentAPIUser = {
  userId?: ObjectId;
  teacherId?: ObjectId;
  role: string;
  token?: string;
};

export { IHttpRequest, CurrentAPIUser };
