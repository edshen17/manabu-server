import express from 'express';
import {
  makeGetUserController,
  makePostUserController,
  makePutUserController,
} from '../../../components/controllers/user';
import { makeExpressCallback } from '../../../components/expressCallback';
const user = express.Router();
const VerifyToken = require('../../../components/VerifyToken'); // TODO: turn into ts + import statement

user.get('/:uId', VerifyToken, makeExpressCallback(makeGetUserController));
user.get('/me', VerifyToken, makeExpressCallback(makeGetUserController));
user.post('/register', makeExpressCallback(makePostUserController));
user.put('/:uId/updateProfile', VerifyToken, makeExpressCallback(makePutUserController));

export default user;
