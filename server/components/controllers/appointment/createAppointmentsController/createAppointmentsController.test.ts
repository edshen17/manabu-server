import { expect } from 'chai';
import { IHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder/iHttpRequestBuilder';
import { makeIHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import dayjs from 'dayjs';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { CreateAppointmentsController } from './createAppointmentsController';
import { makeCreateAppointmentsController } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { StringKeyObject } from '../../../../types/custom';

let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let availableTimeDbService: AvailableTimeDbService;
let firstFakePackageTransaction: PackageTransactionDoc;
let secondFakePackageTransaction: PackageTransactionDoc;
let fakeAvailableTime: AvailableTimeDoc;
let currentAPIUser: CurrentAPIUser;
let body: StringKeyObject;
let createAppointmentsController: CreateAppointmentsController;
let firstAppointment: any;
let secondAppointment: any;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  availableTimeDbService = await makeAvailableTimeDbService;
  createAppointmentsController = await makeCreateAppointmentsController;
});

beforeEach(async () => {
  firstFakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  secondFakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
    hostedById: firstFakePackageTransaction.hostedById,
    startDate: dayjs().toDate(),
    endDate: dayjs().add(3, 'hour').toDate(),
  });
  body = {
    appointments: [
      {
        hostedById: firstFakePackageTransaction.hostedById,
        reservedById: firstFakePackageTransaction.reservedById,
        packageTransactionId: firstFakePackageTransaction._id,
        startDate: fakeAvailableTime.startDate,
        endDate: dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
      },
      {
        hostedById: firstFakePackageTransaction.hostedById,
        reservedById: firstFakePackageTransaction.reservedById,
        packageTransactionId: firstFakePackageTransaction._id,
        startDate: dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
        endDate: dayjs(fakeAvailableTime.startDate).add(2, 'hour').toDate(),
      },
    ],
  };
  currentAPIUser = {
    userId: firstFakePackageTransaction.reservedById,
    role: 'user',
  };
  firstAppointment = body.appointments[0];
  secondAppointment = body.appointments[1];
});

describe('createAppointmentsTimeController', () => {
  describe('makeRequest', () => {
    const createAppointments = async () => {
      const createAppointmentsHttpRequest = iHttpRequestBuilder
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const createAppointments = await createAppointmentsController.makeRequest(
        createAppointmentsHttpRequest
      );
      return createAppointments;
    };
    context('valid inputs', () => {
      it('should create a new appointment', async () => {
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(201);
        if ('appointments' in createAppointmentsRes.body) {
          expect(createAppointmentsRes.body.appointments[0].hostedById).to.deep.equal(
            firstFakePackageTransaction.hostedById
          );
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        firstAppointment.startDate = 'some id';
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if there is an appointment overlap', async () => {
        await createAppointments();
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if body contains an hostedById other than the currentAPIUser id', async () => {
        firstAppointment.hostedById = '507f1f77bcf86cd799439011';
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if body contains an foreign keys that do not exist', async () => {
        firstAppointment.hostedById = '507f1f77bcf86cd799439011';
        firstAppointment.reservedById = '507f1f77bcf86cd799439011';
        firstAppointment.packageTransactionId = '507f1f77bcf86cd799439011';
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if the lesson duration is wrong', async () => {
        firstAppointment.endDate = dayjs(firstAppointment.endDate).add(1, 'hour').toDate();
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if no corresponding available time exists', async () => {
        firstAppointment.startDate = dayjs().add(5, 'hour').toDate();
        firstAppointment.endDate = dayjs().add(6, 'hour').toDate();
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if appointment goes over available time', async () => {
        firstAppointment.startDate = dayjs(firstAppointment.startDate).add(3, 'hour').toDate();
        firstAppointment.endDate = dayjs(firstAppointment.startDate).add(4, 'hour').toDate();
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if one of the appointments is not of the same type', async () => {
        secondAppointment.packageTransactionId = secondFakePackageTransaction._id;
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if the user is not logged in', async () => {
        currentAPIUser.userId = undefined;
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
    });
  });
});
