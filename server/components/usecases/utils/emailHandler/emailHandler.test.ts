import { makeEmailHandler } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbBalanceTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbBalanceTransactionFactory';
import { FakeDbBalanceTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbBalanceTransactionFactory/fakeDbBalanceTransactionFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { EmailHandler, EMAIL_HANDLER_SENDER_ADDRESS, EMAIL_HANDLER_TEMPLATE } from './emailHandler';

let emailHandler: EmailHandler;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeDbBalanceTransactionFactory: FakeDbBalanceTransactionFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeAppointment: AppointmentDoc;
let fakeBalanceTransaction: BalanceTransactionDoc;
let fakeUser: JoinedUserDoc;

before(async () => {
  emailHandler = await makeEmailHandler;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
  fakeDbBalanceTransactionFactory = await makeFakeDbBalanceTransactionFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData(undefined, true);
  fakeBalanceTransaction = await fakeDbBalanceTransactionFactory.createFakeDbData();
  fakeUser = await fakeDbUserFactory.createFakeDbData(undefined, true);
});

// does not send mail if NODE_ENV not production.
describe('emailHandler', () => {
  describe('teacherAppointmentCreation', () => {
    it('should send the email', async () => {
      await emailHandler.send({
        to: 'greencopter4444@gmail.com',
        from: EMAIL_HANDLER_SENDER_ADDRESS.SUPPORT,
        templateName: EMAIL_HANDLER_TEMPLATE.ADMIN_INTRODUCTION,
        data: {
          name: 'test',
          appointment: fakeAppointment,
          balanceTransaction: fakeBalanceTransaction,
          verificationToken: 'some verification token',
          user: fakeUser,
          userType: fakeUser.role,
        },
        locale: 'ja',
      });
    });
  });
});
