import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

const ContentSchema = createSchema({
  postedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  //   collectionId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  title: Type.string({ required: true, index: true }),
  titleNGrams: Type.string({ required: true }),
  coverImageUrl: Type.string({ required: false }),
  sourceUrl: Type.string({ required: true }),
  summary: Type.string({ required: false }),
  tokens: Type.string({ required: true }),
  tokenSaliences: Type.string({ required: true }),
  categories: Type.array({ required: true }).of(Type.string({ required: true })),
  ownership: Type.string({ required: true, enum: ['public', 'private'] }),
  author: Type.string({ required: true }),
  type: Type.string({ required: true, enum: ['article', 'book', 'video', 'wikipedia'] }),
  language: Type.string({ required: true, index: true }),
  likes: Type.number({ required: true }),
  views: Type.number({ required: true }),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const Content = typedModel('Content', ContentSchema);
type ContentDoc = ExtractDoc<typeof ContentSchema>;

export { Content, ContentSchema, ContentDoc };
