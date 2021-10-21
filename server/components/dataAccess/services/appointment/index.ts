import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { Appointment } from '../../../../models/Appointment';
import { makeCacheDbService } from '../cache';
import { makePackageTransactionDbService } from '../packageTransaction';
import { AppointmentDbService } from './appointmentDbService';

const makeAppointmentDbService = new AppointmentDbService().init({
  mongoose,
  dbModel: Appointment,
  cloneDeep,
  makePackageTransactionDbService,
  makeCacheDbService,
});

export { makeAppointmentDbService };
