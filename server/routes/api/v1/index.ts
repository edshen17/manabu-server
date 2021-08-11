import express from 'express';
import { users } from './users/index';
import { teachers } from './teachers/index';
import { availableTime } from './availableTimes';
import { appointments } from './appointments';

const api = express.Router();
api.use('/users', users);
api.use('/teachers', teachers);
api.use('/availableTimes', availableTime);
api.use('/appointments', appointments);

export { api };
