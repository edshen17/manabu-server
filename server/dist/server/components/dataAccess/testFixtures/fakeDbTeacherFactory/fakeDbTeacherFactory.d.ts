import { TeacherEntityBuildParams, TeacherEntityBuildResponse } from '../../../entities/teacher/teacherEntity';
import { AbstractFakeDbEmbeddedDataFactory } from '../abstractions/AbstractFakeDbEmbeddedDataFactory';
declare type OptionalFakeDbTeacherFactoryInitParams = {};
declare class FakeDbTeacherFactory extends AbstractFakeDbEmbeddedDataFactory<OptionalFakeDbTeacherFactoryInitParams, TeacherEntityBuildParams, TeacherEntityBuildResponse> {
    createFakeData: () => Promise<TeacherEntityBuildResponse>;
    protected _createFakeBuildParams: () => Promise<TeacherEntityBuildParams>;
}
export { FakeDbTeacherFactory };
