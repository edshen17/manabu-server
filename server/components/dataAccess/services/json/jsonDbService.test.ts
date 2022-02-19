// import { expect } from 'chai';
// import { makeJsonDbService } from '.';
// import { JsonDbService } from './jsonDbService';

// let jsonDbService: JsonDbService;

// before(async () => {
//   jsonDbService = await makeJsonDbService;
// });

// describe('jsonDbService', () => {
//   describe('insert', () => {
//     it('should insert a document', async () => {
//       const word = await jsonDbService.insert({
//         modelName: 'ja-ja:word',
//         modelToInsert: {
//           word: 'test',
//           definition: 'hihi',
//           audioLinks: ['teest', 'saas'],
//         },
//       });
//       expect(word.word).to.equal('test');
//       await jsonDbService.findByIdAndDelete({ modelName: 'ja-ja:word', _id: word._id });
//     });
//   });
//   describe('findById', () => {
//     it('should find the document', async () => {
//       const word = await jsonDbService.insert({
//         modelName: 'ja-ja:word',
//         modelToInsert: {
//           word: 'some word',
//           definition: 'hihi',
//         },
//       });
//       const findByIdWord = await jsonDbService.findById({ modelName: 'ja-ja:word', _id: word._id });
//       expect(findByIdWord.word).to.equal('some word');
//     });
//   });
//   describe('findByIdAndDelete', () => {
//     it('should delete the document', async () => {
//       const word = await jsonDbService.insert({
//         modelName: 'ja-ja:word',
//         modelToInsert: {
//           word: 'some word',
//           definition: 'hihi',
//         },
//       });
//       await jsonDbService.findByIdAndDelete({
//         modelName: 'ja-ja:word',
//         _id: word._id,
//       });
//       const findByIdWord = await jsonDbService.findById({ modelName: 'ja-ja:word', _id: word._id });
//       expect(findByIdWord).to.equal(null);
//     });
//   });
//   describe('search', () => {
//     it('should return relevant words', async () => {
//       const word1 = await jsonDbService.insert({
//         modelName: 'ja-ja:word',
//         modelToInsert: {
//           word: 'test',
//           definition: 'hihi',
//           audioLinks: ['teest', 'saas'],
//         },
//       });
//       const searchWord = await jsonDbService.search({
//         modelName: 'ja-ja:word',
//         searchQuery: '@word:(日)',
//         options: {
//           LIMIT: {
//             from: 0,
//             size: 10,
//           },
//         },
//       });
//       expect(searchWord.total > 0).to.equal(true);
//     });
//   });
// });
