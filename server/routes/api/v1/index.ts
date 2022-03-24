import express from 'express';
import { admin } from './admin';
import { appointments } from './appointments';
import { availableTimes } from './availableTimes';
import { checkout } from './checkout';
import { contents } from './contents';
import { exchangeRates } from './exchangeRates';
import { packages } from './packages';
import { packageTransactions } from './packageTransactions';
import { teachers } from './teachers/index';
import { users } from './users/index';
import { webhooks } from './webhooks';
import { words } from './words';

const api = express.Router();
api.use('/appointments', appointments);
api.use('/availableTimes', availableTimes);
api.use('/packages', packages);
api.use('/teachers', teachers);
api.use('/users', users);
api.use('/exchangeRates', exchangeRates);
api.use('/packageTransactions', packageTransactions);
api.use('/checkout', checkout);
api.use('/webhooks', webhooks);
api.use('/words', words);
api.use('/admin', admin);
api.use('/contents', contents);

export { api };
