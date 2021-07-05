import express from 'express';
import users from './users/index';
import teachers from './teachers/index';

const router = express.Router();
router.use('/users/', users);
router.use('/teachers/', teachers);

export { router as api };
