import dayjs from 'dayjs';
import { makeSplitAvailableTimeHandler } from '.';
import { AppointmentDoc } from '../../../../models/Appointment';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { makeFakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory';
import { FakeDbAppointmentFactory } from '../../../dataAccess/testFixtures/fakeDbAppointmentFactory/fakeDbAppointmentFactory';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { SplitAvailableTimeHandler } from './splitAvailableTimeHandler';

let splitAvailableTimeHandler: SplitAvailableTimeHandler;
let fakeDbAppointmentFactory: FakeDbAppointmentFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeAppointment: AppointmentDoc;
let fakeAvailableTime: AvailableTimeDoc;
let fakePackageTransaction: PackageTransactionDoc;
let availableTimeDbService: AvailableTimeDbService;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  splitAvailableTimeHandler = await makeSplitAvailableTimeHandler;
  fakeDbAppointmentFactory = await makeFakeDbAppointmentFactory;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  availableTimeDbService = await makeAvailableTimeDbService;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  dbServiceAccessOptions = availableTimeDbService.getBaseDbServiceAccessOptions();
});

describe('splitAvailableTimeHandler', () => {
  context('valid input', () => {
    const splitAvailableTime = async (props: {
      availableTimeStartDate: Date;
      availableTimeEndDate: Date;
      appointmentStartDate: Date;
      appointmentEndDate: Date;
    }): Promise<AvailableTimeDoc> => {
      const {
        availableTimeStartDate,
        availableTimeEndDate,
        appointmentStartDate,
        appointmentEndDate,
      } = props;
      fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById,
        startDate: availableTimeStartDate,
        endDate: availableTimeEndDate,
      });
      fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: appointmentStartDate,
        endDate: appointmentEndDate,
      });
      await splitAvailableTimeHandler.split([fakeAppointment]);
      const updatedAvailableTime = await availableTimeDbService.findOne({
        searchQuery: {
          hostedById: fakeAppointment.hostedById,
        },
        dbServiceAccessOptions,
      });
      return updatedAvailableTime;
    };
    context("appointment startTime is the same as availableTime's startTime", () => {
      it('should split the availableTime so that it starts at the end of the appointment', async () => {
        const splitAvailableTimeParams = {
          availableTimeStartDate: dayjs().toDate(),
          availableTimeEndDate: dayjs().add(3, 'hour').toDate(),
          appointmentStartDate: dayjs().toDate(),
          appointmentEndDate: dayjs().add(1, 'hour').toDate(),
        };
        const updatedAvailableTime = await splitAvailableTime(splitAvailableTimeParams);
        expect(
          dayjs(updatedAvailableTime.startDate).isSame(dayjs(fakeAvailableTime.startDate), 'minute')
        ).to.equal(false);
        expect(
          dayjs(updatedAvailableTime.endDate).isSame(dayjs(fakeAvailableTime.endDate), 'minute')
        ).to.equal(true);
        expect(
          dayjs(updatedAvailableTime.startDate).isSame(
            dayjs(splitAvailableTimeParams.appointmentEndDate),
            'minute'
          )
        ).to.equal(true);
      });
    });
    context(
      "appointment startTime and endTime is not the same as availableTime's startTime and endTime",
      () => {
        it('should split the availableTime so that there is one before the appointment and one after', async () => {
          const splitAvailableTimeParams = {
            availableTimeStartDate: dayjs().toDate(),
            availableTimeEndDate: dayjs().add(3, 'hour').toDate(),
            appointmentStartDate: dayjs().add(1, 'hour').toDate(),
            appointmentEndDate: dayjs().add(2, 'hour').toDate(),
          };
          const updatedAvailableTime = await splitAvailableTime(splitAvailableTimeParams);
          const newAvailableTime = await availableTimeDbService.findOne({
            searchQuery: {
              hostedById: fakePackageTransaction.hostedById,
              startDate: splitAvailableTimeParams.appointmentStartDate,
            },
            dbServiceAccessOptions,
          });
          expect(dayjs(updatedAvailableTime.startDate).isSame(dayjs(fakeAvailableTime.startDate)));
          expect(
            dayjs(updatedAvailableTime.endDate).isSame(
              dayjs(fakeAvailableTime.startDate).add(1, 'hour')
            )
          );
          expect(
            dayjs(newAvailableTime.endDate).isSame(
              dayjs(splitAvailableTimeParams.availableTimeEndDate)
            )
          );
        });
      }
    );
    context("appointment endTime is the same as availableTime's endTime", () => {
      it('should split the availableTime so that it ends at the start of the appointment', async () => {
        const splitAvailableTimeParams = {
          availableTimeStartDate: dayjs().toDate(),
          availableTimeEndDate: dayjs().add(3, 'hour').toDate(),
          appointmentStartDate: dayjs().add(2, 'hour').toDate(),
          appointmentEndDate: dayjs().add(3, 'hour').toDate(),
        };
        const updatedAvailableTime = await splitAvailableTime(splitAvailableTimeParams);
        expect(updatedAvailableTime.endDate).to.not.deep.equal(fakeAvailableTime.endDate);
        expect(updatedAvailableTime.startDate).to.deep.equal(fakeAvailableTime.startDate);
        expect(updatedAvailableTime.endDate).to.deep.equal(
          splitAvailableTimeParams.appointmentStartDate
        );
      });
    });
  });
});
