import express from 'express';
import { makePutEditTeacherController } from '../../../components/controllers/teacher';
import { makeExpressCallback } from '../../../components/expressCallback/callbacks';

const teachers = express.Router();
const VerifyToken = require('../../../components/VerifyToken'); // TODO: turn into ts + import statement

//teachers.get('/')
teachers.put('/:uId', VerifyToken, makeExpressCallback.consume(makePutEditTeacherController));

export default teachers;
