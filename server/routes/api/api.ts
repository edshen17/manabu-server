import express from 'express';
import users from './user/index';
import teachers from './teacher/index';
const router = express.Router();
router.use('/users/', users);
router.use('/teachers/', teachers);

module.exports = router;
