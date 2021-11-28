import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

// are these requuired = true?
const translationDataEmbed = {
    sourceLanguage: Type.string({ required: false }),
    targetLanguage: Type.string({ required: true }),
    translatedText: Type.string({ required: true }),
};

const ImageScanSchema = createSchema({
  userId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  imageURL: Type.string({ required: true }),
  ocrText: Type.string({ required: true }),
  translationData: Type.array({ required: false }).of(translationDataEmbed),
  creationDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const ImageScan = typedModel('AvailableTime', ImageScanSchema);
type ImageScanDoc = ExtractDoc<typeof ImageScanSchema>;

export { ImageScan, ImageScanSchema, ImageScanDoc, translationDataEmbed };
