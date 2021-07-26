import express from 'express';
import { api } from './v1';

const v1 = express.Router();

v1.use('/v1', api);

export { v1 };
