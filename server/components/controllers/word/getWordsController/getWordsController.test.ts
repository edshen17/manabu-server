// import { expect } from 'chai';
// import { makeGetWordsController } from '.';
// import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
// import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
// import { GetWordsController } from './getWordsController';

// let iHttpRequestBuilder: IHttpRequestBuilder;
// let getWordsController: GetWordsController;

// before(async () => {
//   iHttpRequestBuilder = makeIHttpRequestBuilder;
//   getWordsController = await makeGetWordsController;
// });

// describe('getWordsController', () => {
//   describe('makeRequest', () => {
//     it('should return the search results of a word', async () => {
//       const getWordsHttpRequest = iHttpRequestBuilder
//         .currentAPIUser({
//           userId: undefined,
//           role: 'user',
//         })
//         .params({
//           word: 'hi',
//         })
//         .query({
//           wordLanguage: 'ja',
//           definitionLanguage: 'ja',
//         })
//         .build();
//       const getWordsRes = await getWordsController.makeRequest(getWordsHttpRequest);
//       expect(getWordsRes.statusCode).to.equal(200);
//       if ('words' in getWordsRes.body!) {
//         expect(getWordsRes.body.words.length > 0).to.equal(true);
//       }
//     });
//   });
// });
