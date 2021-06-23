import { TeacherDoc } from '../../../../models/Teacher';
import { TeacherEntityResponse } from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

class FakeDbTeacherFactory extends AbstractFakeDbDataFactory<TeacherDoc, TeacherEntityResponse> {}

export { FakeDbTeacherFactory };
