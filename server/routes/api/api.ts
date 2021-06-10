import express from 'express';
import user from './user/index';
const router = express.Router();
router.use('/user/', user);

module.exports = router;
