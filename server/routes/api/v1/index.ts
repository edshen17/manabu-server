import express from 'express';
import { appointments } from './appointments';
import { availableTime } from './availableTimes';
import { teachers } from './teachers/index';
import { users } from './users/index';

const api = express.Router();
api.use('/users', users);
api.use('/teachers', teachers);
api.use('/availableTimes', availableTime);
api.use('/appointments', appointments);

export { api };
