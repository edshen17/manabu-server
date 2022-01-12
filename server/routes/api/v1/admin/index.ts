import express from 'express';
import { makeGetPendingTeachersController } from '../../../../components/controllers/teacher/getPendingTeachersController';
import { makeJSONExpressCallback } from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const admin = express.Router();

admin.get('/pendingTeachers', makeJSONExpressCallback.consume(makeGetPendingTeachersController));

export { admin };
