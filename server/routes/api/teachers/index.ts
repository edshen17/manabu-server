import express from 'express';
import { makeEditTeacherController } from '../../../components/controllers/teacher/editTeacherController';
import { makeJSONExpressCallback } from '../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const teachers = express.Router();
const VerifyToken = require('../../../components/VerifyToken'); // TODO: turn into ts + import statement

teachers.put(
  '/:teacherId',
  VerifyToken,
  makeJSONExpressCallback.consume(makeEditTeacherController)
);

export { teachers };
