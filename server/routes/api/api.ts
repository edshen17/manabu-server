import express from 'express';
import { users } from './users/index';
import { teachers } from './teachers/index';

const api = express.Router();
api.use('/users/', users);
api.use('/teachers/', teachers);

export { api };
