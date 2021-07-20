import cloneDeep from 'clone-deep';
import { makeDb } from '../..';
import { Appointment } from '../../../../models/Appointment';
import { AppointmentDbService } from './appointmentDbService';

const makeAppointmentDbService = new AppointmentDbService().init({
  makeDb,
  dbModel: Appointment,
  cloneDeep,
});

export { makeAppointmentDbService };
