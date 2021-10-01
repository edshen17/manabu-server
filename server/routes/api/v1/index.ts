import express from 'express';
import { appointments } from './appointments';
import { availableTimes } from './availableTimes';
import { packages } from './packages';
import { teachers } from './teachers/index';
import { users } from './users/index';

const api = express.Router();
api.use('/appointments', appointments);
api.use('/availableTimes', availableTimes);
api.use('/packages', packages);
api.use('/teachers', teachers);
api.use('/users', users);

export { api };
