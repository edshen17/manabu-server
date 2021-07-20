import mongoose, { ObjectId } from 'mongoose';

const convertStringToObjectId = (objectIdString: string): ObjectId => {
  const objectId: any = new mongoose.Types.ObjectId(objectIdString);
  return objectId;
};

export { convertStringToObjectId };
