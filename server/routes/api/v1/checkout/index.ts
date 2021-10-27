import express from 'express';
import { packageTransaction } from './packageTransaction';

const checkout = express.Router();

checkout.use('/packageTransaction', packageTransaction);

export { checkout };
