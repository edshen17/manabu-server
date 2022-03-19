import { createSchema, ExtractDoc, Type, typedModel } from 'ts-mongoose';
import { UserSchema } from './User';

const ContentSchema = createSchema({
  postedById: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  //   collectionId: Type.ref(Type.objectId({ required: true, index: true })).to('User', UserSchema),
  title: Type.string({ required: true, index: true }),
  language: Type.string({ required: true, index: true }),
  titleNGrams: Type.string({ required: true }),
  rawContent: Type.string({ required: true }),
  coverImageUrl: Type.string({ required: true }),
  sourceUrl: Type.string({ required: true }),
  summary: Type.string({ required: false }),
  entities: Type.array({ required: true }).of({
    word: Type.string({ required: true }),
    salience: Type.number({ required: true }),
  }),
  tokens: Type.array({ required: true }).of(Type.string({ required: true })),
  categories: Type.array({ required: true }).of(Type.string({ required: true })),
  ownership: Type.string({ required: true, enum: ['public', 'private'] }),
  author: Type.string({ required: true }),
  type: Type.string({ required: true, enum: ['article', 'book', 'video', 'wikipedia'] }),
  createdDate: Type.date({ required: true }),
  lastModifiedDate: Type.date({ required: true }),
});

const Content = typedModel('Content', ContentSchema);
type ContentDoc = ExtractDoc<typeof ContentSchema>;

export { Content, ContentSchema, ContentDoc };
