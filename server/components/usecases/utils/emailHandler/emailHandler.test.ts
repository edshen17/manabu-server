import { makeEmailHandler } from '.';
import { EmailHandler, EMAIL_HANDLER_SENDER_ADDRESS } from './emailHandler';

let emailHandler: EmailHandler;

before(async () => {
  emailHandler = await makeEmailHandler;
});

// does not send mail if NODE_ENV not production. Uncomment only when you want to test email html.
describe('emailHandler', () => {
  context('english', () => {
    it('should send the email in english', async () => {
      await emailHandler.send({
        to: 'greencopter4444@gmail.com',
        from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
        subject: `test email`,
        mjmlFileName: 'studentAppointmentUpdate',
        data: {
          name: 'test',
        },
        locale: 'ja',
      });
    });
  });
});
