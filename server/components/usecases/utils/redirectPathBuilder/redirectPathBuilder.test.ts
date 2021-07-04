// import { expect } from 'chai';
// import { makeRedirectPathBuilder } from '.';
// import { RedirectPathBuilder } from './redirectPathBuilder';

// let redirectPathBuilder: RedirectPathBuilder;

// before(() => {
//   redirectPathBuilder = makeRedirectPathBuilder;
// });

// describe('redirectPathBuilder', () => {
//   describe('build', () => {
//     context('given valid inputs', () => {
//       it('should build an empty redirectPath from no inputs', () => {
//         const redirectPath = redirectPathBuilder.build();
//         expect(redirectPath).to.equal('');
//       });
//       context('server redirect', () => {
//         context('without query strings', () => {
//           it('should redirect to the server', () => {
//             const redirectPath = redirectPathBuilder
//               .host('server')
//               .endpointPath('/users/register')
//               .build();
//             expect(redirectPath).to.equal('http://localhost:5000/api/users/register');
//           });
//         });
//         context('with query strings', () => {
//           it('should redirect to the server', () => {
//             const redirectPath = redirectPathBuilder
//               .host('server')
//               .endpointPath('/users/register')
//               .queryStrings({
//                 state: 'some state',
//                 id: 'some id',
//               })
//               .build();
//             expect(redirectPath).to.equal('http://localhost:5000/api/users/register');
//           });
//         });
//       });
//       context('client redirect', () => {
//         context('without query strings', () => {
//           it('should redirect to the client', () => {
//             const redirectPath = redirectPathBuilder
//               .host('client')
//               .endpointPath('/dashboard')
//               .build();
//             expect(redirectPath).to.equal('http://localhost:8080/dashboard');
//           });
//         });
//         context('with query strings', () => {
//           const redirectPath = redirectPathBuilder
//             .host('client')
//             .endpointPath('/dashboard')
//             .queryStrings({
//               state: 'some state',
//               id: 'some id',
//             })
//             .build();
//           expect(redirectPath).to.equal('http://localhost:8080/dashboard');
//         });
//       });
//     });
//   });
// });
