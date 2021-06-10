import express from 'express';
import { makeGetUserController, makePostUserController } from '../../components/controllers/user';
import { makeExpressCallback } from '../../components/expressCallback/index';

const router = express.Router();
const VerifyToken = require('../../components/VerifyToken'); // TODO: turn into ts + import statement

// USER ROUTES
router.get('/user/:uId', VerifyToken, makeExpressCallback(makeGetUserController));
router.get('/me', VerifyToken, makeExpressCallback(makeGetUserController));
router.post('/register', makeExpressCallback(makePostUserController));
router.get('/test', (req, res, next) => {
  res.status(200).json({ _id: '123987asda9898899' });
});

module.exports = router;
