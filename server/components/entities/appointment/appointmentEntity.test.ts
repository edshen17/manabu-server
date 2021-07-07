import { expect } from 'chai';
import { makeAppointmentEntity } from '.';
import { makeFakeDbPackageTransactionFactory } from '../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { makeFakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { AppointmentEntity } from './appointmentEntity';

let appointmentEntity: AppointmentEntity;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;

before(async () => {
  appointmentEntity = await makeAppointmentEntity;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

describe('appointmentEntity', () => {
  describe('build', () => {
    context('valid inputs', () => {
      it('should build an appointment that has the given inputs as well as additional information from the db', async () => {
        const fakeHostedBy = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const fakeReservedBy = await fakeDbUserFactory.createFakeDbUser();
        const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
          hostedBy: fakeHostedBy._id,
          reservedBy: fakeReservedBy._id,
          packageId: fakeHostedBy.teacherData.packages[0]._id,
          reservationLength: 60,
          transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
          remainingAppointments: 0,
          lessonLanguage: 'ja',
          isSubscription: false,
          paymentMethodData: {},
        });
        const fakeAppointment = await appointmentEntity.build({
          hostedBy: fakeHostedBy._id,
          reservedBy: fakeReservedBy._id,
          packageTransactionId: fakePackageTransaction._id,
          from: new Date(),
          to: new Date(),
        });
        expect(fakeAppointment.hostedBy).to.equal(fakeHostedBy._id);
        expect(fakeAppointment.reservedBy).to.equal(fakeReservedBy._id);
        expect(fakeAppointment).to.have.property('hostedByData');
        expect(fakeAppointment).to.have.property('reservedByData');
        expect(fakeAppointment).to.have.property('packageTransactionData');
        expect(fakeAppointment).to.have.property('locationData');
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', async () => {
        try {
          const entityData: any = {};
          const fakeAppointment = await appointmentEntity.build(entityData);
        } catch (err) {
          expect(err).to.be.an('error');
        }
      });
    });
  });
});
