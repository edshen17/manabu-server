import express from 'express';
import { makeEditTeacherController } from '../../../../components/controllers/teacher/editTeacherController';
import { makeGetTeachersController } from '../../../../components/controllers/teacher/getTeachersController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const teachers = express.Router();

teachers.get('/', makeJSONExpressCallback.consume(makeGetTeachersController));

teachers.patch('/:teacherId', makeJSONExpressCallback.consume(makeEditTeacherController));

export { teachers };
