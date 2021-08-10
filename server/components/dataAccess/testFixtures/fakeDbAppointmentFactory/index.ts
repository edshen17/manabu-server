import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import { makeAppointmentEntity } from '../../../entities/appointment';
import { makeAppointmentDbService } from '../../services/appointment';
import { makeFakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory';
import { FakeDbAppointmentFactory } from './fakeDbAppointmentFactory';

const makeFakeDbAppointmentFactory = new FakeDbAppointmentFactory().init({
  cloneDeep,
  makeEntity: makeAppointmentEntity,
  makeDbService: makeAppointmentDbService,
  makeFakeDbPackageTransactionFactory,
  dayjs,
});

export { makeFakeDbAppointmentFactory };
