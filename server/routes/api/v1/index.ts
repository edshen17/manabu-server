import express from 'express';
import { appointments } from './appointments';
import { availableTimes } from './availableTimes';
import { teachers } from './teachers/index';
import { users } from './users/index';

const api = express.Router();
api.use('/users', users);
api.use('/teachers', teachers);
api.use('/availableTimes', availableTimes);
api.use('/appointments', appointments);

export { api };
