import express, { Request, Response, NextFunction } from 'express';
import { makeGetUserController, makePostUserController } from '../../components/controllers/user';
import { makeExpressCallback } from '../../components/expressCallback/index';

const router = express.Router();
const VerifyToken = require('../../components/VerifyToken'); // TODO: turn into ts + import statement

router.get('/user/:uId', VerifyToken, makeExpressCallback(makeGetUserController));

router.post('/register', makeExpressCallback(makePostUserController));

module.exports = router;
