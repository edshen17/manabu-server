import { Request } from 'express';
export interface IHttpRequest {
  body: Request['body'];
  path: Request['path'];
  query: Request['query'];
  params: Request['params'];
  currentAPIUser: {
    userId?: string;
    role: string;
  };
}
