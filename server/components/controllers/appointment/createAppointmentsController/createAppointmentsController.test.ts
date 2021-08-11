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

let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let availableTimeDbService: AvailableTimeDbService;
let fakePackageTransaction: PackageTransactionDoc;
let fakeAvailableTime: AvailableTimeDoc;
let currentAPIUser: CurrentAPIUser;
let body: StringKeyObject;
let createAppointmentsController: CreateAppointmentsController;
let bodyAppointment: any;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  availableTimeDbService = await makeAvailableTimeDbService;
  createAppointmentsController = await makeCreateAppointmentsController;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData({
    hostedById: fakePackageTransaction.hostedById,
    startDate: dayjs().toDate(),
    endDate: dayjs().add(3, 'hour').toDate(),
  });
  body = {
    appointments: [
      {
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: fakeAvailableTime.startDate,
        endDate: dayjs(fakeAvailableTime.startDate).add(1, 'hour').toDate(),
      },
    ],
  };
  currentAPIUser = {
    userId: fakePackageTransaction.reservedById,
    role: 'user',
  };
  bodyAppointment = body.appointments[0];
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
            fakePackageTransaction.hostedById
          );
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        bodyAppointment.startDate = 'some id';
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if there is an appointment overlap', async () => {
        await createAppointments();
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if body contains an hostedById other than the currentAPIUser id', async () => {
        bodyAppointment.hostedById = '507f1f77bcf86cd799439011';
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if body contains an foreign keys that do not exist', async () => {
        bodyAppointment.hostedById = '507f1f77bcf86cd799439011';
        bodyAppointment.reservedById = '507f1f77bcf86cd799439011';
        bodyAppointment.packageTransactionId = '507f1f77bcf86cd799439011';
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if the lesson duration is wrong', async () => {
        bodyAppointment.endDate = dayjs(bodyAppointment.endDate).add(1, 'hour').toDate();
        const createAppointmentsRes = await createAppointments();
        expect(createAppointmentsRes.statusCode).to.equal(500);
      });
      it('should throw an error if no corresponding available time exists', async () => {
        bodyAppointment.startDate = dayjs().add(5, 'hour').toDate();
        bodyAppointment.endDate = dayjs().add(6, 'hour').toDate();
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
