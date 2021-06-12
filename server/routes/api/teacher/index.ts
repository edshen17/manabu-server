import express from 'express';
import { makePutTeacherController } from '../../../components/controllers/teacher';
import { makeExpressCallback } from '../../../components/expressCallback';
const teachers = express.Router();
const VerifyToken = require('../../../components/VerifyToken'); // TODO: turn into ts + import statement
//teachers.get('/')
teachers.put('/:uId', VerifyToken, makeExpressCallback(makePutTeacherController));

export default teachers;
