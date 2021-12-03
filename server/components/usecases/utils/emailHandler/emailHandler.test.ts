import { makeEmailHandler } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { EmailHandler, EMAIL_HANDLER_SENDER_ADDRESS } from './emailHandler';

let emailHandler: EmailHandler;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeAppointment: AppointmentDoc;

before(async () => {
  emailHandler = await makeEmailHandler;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
});

beforeEach(async () => {
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData(undefined, true);
});

// does not send mail if NODE_ENV not production.
describe('emailHandler', () => {
  describe('teacherAppointmentCreation', () => {
    it('should send the email', async () => {
      await emailHandler.send({
        to: 'greencopter4444@gmail.com',
        from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
        subject: 'test subject',
        mjmlFileName: 'teacherAppointmentCreation',
        data: {
          name: 'test',
          appointment: fakeAppointment,
        },
        locale: 'ja',
      });
    });
  });
});
