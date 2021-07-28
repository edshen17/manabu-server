import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { Appointment } from '../../../../models/Appointment';
import { makeCacheDbService } from '../cache';
import { makePackageTransactionDbService } from '../packageTransaction';
import { AppointmentDbService } from './appointmentDbService';

const makeAppointmentDbService = new AppointmentDbService().init({
  makeDb,
  dbModel: Appointment,
  cloneDeep,
  makePackageTransactionDbService,
  makeCacheDbService,
});

export { makeAppointmentDbService };
