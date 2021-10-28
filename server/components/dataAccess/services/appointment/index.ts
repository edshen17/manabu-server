import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { Appointment } from '../../../../models/Appointment';
import { makeLocationDataHandler } from '../../../entities/utils/locationDataHandler';
import { makeCacheDbService } from '../cache';
import { makePackageTransactionDbService } from '../packageTransaction';
import { makeUserDbService } from '../user';
import { AppointmentDbService } from './appointmentDbService';

const makeAppointmentDbService = new AppointmentDbService().init({
  mongoose,
  dbModel: Appointment,
  cloneDeep,
  makePackageTransactionDbService,
  makeCacheDbService,
  makeUserDbService,
  makeLocationDataHandler,
});

export { makeAppointmentDbService };
