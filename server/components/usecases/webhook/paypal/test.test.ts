// import { StringKeyObject } from '../../../../types/custom';

// const executePayment = async (props: {
//   paymentId: string;
//   payer: StringKeyObject;
//   transactions: StringKeyObject[];
// }): Promise<void> => {
//   const { paymentId, payer, transactions } = props;
//   const { payer_info } = payer;
//   const { payer_id } = payer_info;
//   const paymentJson = {
//     payer_id,
//   };
//   console.log(paymentId, paymentJson);
//   return new Promise((resolve, reject) => {
//     paypal.payment.execute(paymentId, paymentJson, (err: any, payment: StringKeyObject) => {
//       if (err || !payment) {
//         reject(err || payment);
//       }

//       console.log(err, payment, 'here');
//     });
//   });
// };

// describe('test', () => {
//   it('should work', async () => {
//     const json: any = {
//       id: 'WH-0B822768U6390634T-1C948557974021230',
//       create_time: '2022-02-16T18:00:34.528Z',
//       resource_type: 'payment',
//       event_type: 'PAYMENTS.PAYMENT.CREATED',
//       summary: 'Checkout payment is created and approved by buyer',
//       resource: {
//         update_time: '2022-02-16T18:00:34Z',
//         create_time: '2022-02-16T17:59:35Z',
//         redirect_urls: {
//           return_url: 'https://manabu.sg/dashboard?paymentId=PAYID-MIGTXBY65J138292W417641C',
//           cancel_url: 'https://manabu.sg/user/6209d484555c4c16bdc5f07e',
//         },
//         links: [
//           {
//             href: 'https://api.paypal.com/v1/payments/payment/PAYID-MIGTXBY65J138292W417641C',
//             rel: 'self',
//             method: 'GET',
//           },
//           {
//             href: 'https://api.paypal.com/v1/payments/payment/PAYID-MIGTXBY65J138292W417641C/execute',
//             rel: 'execute',
//             method: 'POST',
//           },
//           {
//             href: 'https://www.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-59X77519UA0814240',
//             rel: 'approval_url',
//             method: 'REDIRECT',
//           },
//         ],
//         id: 'PAYID-MIGTXBY65J138292W417641C',
//         state: 'created',
//         transactions: [
//           {
//             amount: {
//               total: '357.55',
//               currency: 'SGD',
//             },
//             payee: {
//               merchant_id: 'X7B6PG7SF2TKY',
//               email: 'manabuminato@gmail.com',
//             },
//             custom: '620d172d1a3818e757c58711-packagetransactions',
//             item_list: {
//               items: [
//                 {
//                   name: 'Minato Manabu - Moderate / Yayoi Kawakami',
//                   sku: 'teacher-6209d484555c4c16bdc5f07e-student-620d172d1a3818e757c58711-ja',
//                   price: '357.55',
//                   currency: 'SGD',
//                   quantity: 1,
//                 },
//               ],
//               shipping_address: {
//                 recipient_name: 'J Jesse Geenen',
//                 line1: 'Mussenberg 16',
//                 city: 'Weert',
//                 state: '',
//                 postal_code: '6005LD',
//                 country_code: 'NL',
//                 default_address: false,
//                 preferred_address: false,
//                 primary_address: false,
//                 disable_for_transaction: false,
//               },
//             },
//             related_resources: [],
//           },
//         ],
//         intent: 'sale',
//         payer: {
//           payment_method: 'paypal',
//           status: 'VERIFIED',
//           payer_info: {
//             email: 'Jessegeenen@hotmail.com',
//             first_name: 'J',
//             last_name: 'Jesse Geenen',
//             payer_id: 'YGRCTJP55C2GJ',
//             shipping_address: {
//               recipient_name: 'J Jesse Geenen',
//               line1: 'Mussenberg 16',
//               city: 'Weert',
//               state: '',
//               postal_code: '6005LD',
//               country_code: 'NL',
//               default_address: false,
//               preferred_address: false,
//               primary_address: false,
//               disable_for_transaction: false,
//             },
//             country_code: 'NL',
//           },
//         },
//         cart: '59X77519UA0814240',
//       },
//       status: 'PENDING',
//       transmissions: [
//         {
//           webhook_url: 'https://www.manabu.sg/api/v1/webhooks/paypal',
//           http_status: 409,
//           reason_phrase: 'HTTP/1.1 200 Connection established',
//           response_headers: {
//             'X-Dns-Prefetch-Control': 'off',
//             Server: 'cloudflare',
//             'CF-RAY': '6df5de5bc9bccf18-IAD',
//             'X-Content-Type-Options': 'nosniff',
//             Connection: 'keep-alive',
//             'X-Download-Options': 'noopen',
//             'X-Permitted-Cross-Domain-Policies': 'none',
//             Date: 'Fri, 18 Feb 2022 08:26:06 GMT',
//             Via: '1.1 vegur',
//             'X-Frame-Options': 'SAMEORIGIN',
//             'Referrer-Policy': 'no-referrer',
//             'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
//             'CF-Cache-Status': 'DYNAMIC',
//             Etag: 'W/"30-5SFZJU4fLRqSBhTCXhy92RMkpPk"',
//             NEL: '{"success_fraction":0,"report_to":"cf-nel","max_age":604800}',
//             'Access-Control-Allow-Credentials': 'true',
//             'Report-To':
//               '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report\\/v3?s=HwJ6DV7AqjG2b%2FuCq3Ull408ZHZbRq2i31RdrmmnzeenCrpxI0EOAyaABS4DMViyXTr8mBLjOvzQxO2o%2BbIkWpm2HKMFQC2vUh6xOJ8TTi5BNFHa0udtLsXxWY9uBjXp"}],"group":"cf-nel","max_age":604800}',
//             'X-Xss-Protection': '0',
//             Vary: 'Origin, Accept-Encoding',
//             'Content-Length': '48',
//             'alt-svc': 'h3=":443"; ma=86400, h3-29=":443"; ma=86400',
//             'Content-Type': 'application/json; charset=utf-8',
//             'Expect-Ct': 'max-age=0',
//           },
//           transmission_id: '59464370-8f52-11ec-b597-f1b5b6f0480a',
//           status: 'PENDING',
//           timestamp: '2022-02-16T18:00:38Z',
//         },
//         {
//           webhook_url: 'https://floating-wave-80444.herokuapp.com/api/v1/webhooks/paypal',
//           http_status: 201,
//           reason_phrase: 'HTTP/1.1 200 Connection established',
//           response_headers: {
//             'X-Dns-Prefetch-Control': 'off',
//             Server: 'Cowboy',
//             'X-Content-Type-Options': 'nosniff',
//             Connection: 'keep-alive',
//             'X-Download-Options': 'noopen',
//             'X-Permitted-Cross-Domain-Policies': 'none',
//             Date: 'Wed, 16 Feb 2022 18:01:29 GMT',
//             Via: '1.1 vegur',
//             'X-Frame-Options': 'SAMEORIGIN',
//             'Referrer-Policy': 'no-referrer',
//             'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
//             Etag: 'W/"234b-xjaUTpNIq4VdzEsHHh5U8/GOc6Q"',
//             'Access-Control-Allow-Credentials': 'true',
//             'X-Xss-Protection': '0',
//             Vary: 'Origin, Accept-Encoding',
//             'Content-Length': '9035',
//             'Expect-Ct': 'max-age=0',
//             'Content-Type': 'application/json; charset=utf-8',
//           },
//           transmission_id: '5944e3e0-8f52-11ec-b597-f1b5b6f0480a',
//           status: 'SUCCESS',
//           timestamp: '2022-02-16T18:00:38Z',
//         },
//       ],
//       links: [
//         {
//           href: 'https://api.paypal.com/v1/notifications/webhooks-events/WH-0B822768U6390634T-1C948557974021230',
//           rel: 'self',
//           method: 'GET',
//           encType: 'application/json',
//         },
//         {
//           href: 'https://api.paypal.com/v1/notifications/webhooks-events/WH-0B822768U6390634T-1C948557974021230/resend',
//           rel: 'resend',
//           method: 'POST',
//           encType: 'application/json',
//         },
//       ],
//       event_version: '1.0',
//     };
//     const { resource } = json;
//     const { transactions, id, payer } = resource;
//     const paymentId = id;
//     await executePayment({ paymentId, payer, transactions });
//   });
// });

// let userDbService: UserDbService;
// let graphDbService: GraphDbService;
// before(async () => {
//   userDbService = await makeUserDbService;
//   graphDbService = await makeGraphDbService;
// });
// const recover = async () => {
//   const dbServiceAccessOptions = userDbService.getOverrideDbServiceAccessOptions();
//   const users = await userDbService.find({
//     searchQuery: {},
//     dbServiceAccessOptions,
//     paginationOptions: {
//       page: 0,
//       limit: 1000000,
//       sort: {},
//     },
//   });
//   for (const user of users) {
//     await graphDbService.createUserNode({ user, dbServiceAccessOptions });
//   }
// };

// describe('should recover', () => {
//   it('should recover', async () => {
//     await recover();
//   });
// });
