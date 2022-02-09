import { ObjectId } from 'mongoose';
declare const convertStringToObjectId: (objectIdString: string) => ObjectId;
declare type ConvertStringToObjectId = typeof convertStringToObjectId;
export { convertStringToObjectId, ConvertStringToObjectId };
