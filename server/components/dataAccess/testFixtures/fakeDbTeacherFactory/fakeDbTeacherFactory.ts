import { TeacherDoc } from '../../../../models/Teacher';
import { TeacherEntityResponse } from '../../../entities/teacher/teacherEntity';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';

class FakeDbTeacherFactory extends AbstractDbDataFactory<TeacherDoc, TeacherEntityResponse> {}

export { FakeDbTeacherFactory };
