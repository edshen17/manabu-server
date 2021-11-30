import { makeEmailHandler } from '.';
import { EmailHandler } from './emailHandler';

let emailHandler: EmailHandler;

before(async () => {
  emailHandler = await makeEmailHandler;
});

// does not send mail if NODE_ENV not production. Uncomment only when you want to test email html.
// describe('emailHandler', () => {
//   context('english', () => {
//     it('should send the email in english', async () => {
//       await emailHandler.send({
//         to: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
//         from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
//         subject: `test email`,
//         mjmlFileName: 'test',
//         data: {
//           name: 'test',
//         },
//         locale: 'ja',
//       });
//     });
//   });
// });
