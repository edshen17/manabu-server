"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../../dataAccess/testFixtures/fakeDbAppointmentFactory");
const fakeDbBalanceTransactionFactory_1 = require("../../../dataAccess/testFixtures/fakeDbBalanceTransactionFactory");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
const emailHandler_1 = require("./emailHandler");
let emailHandler;
let fakeDbAppointmentFactory;
let fakeDbBalanceTransactionFactory;
let fakeDbUserFactory;
let fakeAppointment;
let fakeBalanceTransaction;
let fakeUser;
before(async () => {
    emailHandler = await _1.makeEmailHandler;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
    fakeDbBalanceTransactionFactory = await fakeDbBalanceTransactionFactory_1.makeFakeDbBalanceTransactionFactory;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
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
                from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
                templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.INTERNAL_NEW_USER,
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
