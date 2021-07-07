// import { expect } from 'chai';
// import { makeAppointmentEntityValidator } from '.';
// import { AppointmentEntityValidator } from './appointmentEntityValidator';

// let appointmentEntityValidator: AppointmentEntityValidator;
// let requestBody: {};

// before(() => {
//   appointmentEntityValidator = makeAppointmentEntityValidator;
// });

// describe('appointmentEntityValidator', () => {
//   describe('validate', () => {
//     context('valid inputs', () => {
//       it('should return a valid object', () => {
//         requestBody = {
//           hostedBy: '5d6ede6a0ba62570afcedd3a',
//           reservedBy: '5d6ede6a0ba62570afcedd3a',
//           packageTransactionId: '5d6ede6a0ba62570afcedd3a',
//           from: new Date(),
//           to: new Date(),
//           isPast: false,
//           status: 'pending',
//         };
//         const validatedObj = appointmentEntityValidator.validate(requestBody);
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
//             packageTransactionId: '5d6ede6a0ba62570afcedd3a',
//             from: new Date(),
//             to: new Date(),
//             isPast: false,
//             status: 'pending',
//             hostedByData: {
//               prop: 'some data',
//             },
//             reservedByData: {
//               prop: 'some data',
//             },
//             packageTransactionData: {
//               prop: 'some data',
//             },
//             locationData: {
//               prop: 'some data',
//             },
//           };
//           const validatedObj = appointmentEntityValidator.validate(requestBody);
//         } catch (err) {
//           expect(err).be.an('error');
//         }
//       });
//     });
//   });
// });
