import express from 'express';
import { makeEditTeacherController } from '../../../../components/controllers/teacher/editTeacherController';
import { makeGetTeachersController } from '../../../../components/controllers/teacher/getTeachersController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const teachers = express.Router();
const VerifyToken = require('../../../../components/VerifyToken'); // TODO: turn into ts + import statement, use app.all(VerifyToken) to use it everywhere

teachers.get('/', VerifyToken, makeJSONExpressCallback.consume(makeGetTeachersController));

teachers.patch(
  '/:teacherId',
  VerifyToken,
  makeJSONExpressCallback.consume(makeEditTeacherController)
);

export { teachers };
