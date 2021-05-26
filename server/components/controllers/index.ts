import { IHttpRequest } from '../expressCallback/index';

export interface IControllerResponse {
  headers: Record<string, unknown>;
  success: boolean;
  statusCode: number;
  body: {
    [result: string]: any;
    error?: string;
  };
}

export type Controller = (request: Partial<IHttpRequest>) => Promise<IControllerResponse>;
