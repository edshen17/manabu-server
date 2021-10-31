import express from 'express';
import { packageTransactions } from './packageTransactions';

const checkout = express.Router();

checkout.use('/packageTransactions', packageTransactions);

export { checkout };
