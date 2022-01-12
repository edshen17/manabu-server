import express from 'express';
import { admin } from './admin';
import { appointments } from './appointments';
import { availableTimes } from './availableTimes';
import { checkout } from './checkout';
import { packages } from './packages';
import { packageTransactions } from './packageTransactions';
import { teachers } from './teachers/index';
import { users } from './users/index';
import { utils } from './utils';
import { webhooks } from './webhooks';

const api = express.Router();
api.use('/appointments', appointments);
api.use('/availableTimes', availableTimes);
api.use('/packages', packages);
api.use('/teachers', teachers);
api.use('/users', users);
api.use('/utils', utils);
api.use('/packageTransactions', packageTransactions);
api.use('/checkout', checkout);
api.use('/webhooks', webhooks);
api.use('/admin', admin);

export { api };
