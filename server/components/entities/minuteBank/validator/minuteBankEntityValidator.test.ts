// import { expect } from 'chai';
// import { makeMinuteBankEntityValidator } from '.';
// import { MinuteBankEntityValidator } from './minuteBankEntityValidator';

// let minuteBankEntityValidator: MinuteBankEntityValidator;
// let requestBody: {};

// before(() => {
//   minuteBankEntityValidator = makeMinuteBankEntityValidator;
// });

// describe('minuteBankEntityValidator', () => {
//   describe('validate', () => {
//     context('valid inputs', () => {
//       it('should return a valid object', () => {
//         requestBody = {
//           hostedBy: '5d6ede6a0ba62570afcedd3a',
//           reservedBy: '5d6ede6a0ba62570afcedd3a',
//           minuteBank: 0,
//         };
//         const validatedObj = minuteBankEntityValidator.validate(requestBody);
//         expect(validatedObj).to.deep.equal(requestBody);
//         expect(validatedObj).to.not.have.property('error');
//       });
//     });
//     context('invalid inputs', () => {
//       it('should throw an error', () => {
//         try {
//           requestBody = {
//             hostedBy: '5d6ede6a0ba62570afcedd3a',
//             reservedBy: '5d6ede6a0ba62570afcedd3a',
//             minuteBank: 0,
//             hostedByData: {
//               prop: 'some prop',
//             },
//             reservedByData: {
//               prop: 'some prop',
//             },
//           };
//           const validatedObj = minuteBankEntityValidator.validate(requestBody);
//         } catch (err) {
//           expect(err).be.an('error');
//         }
//       });
//     });
//   });
// });
