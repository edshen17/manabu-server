import { AbstractEntity } from '../abstractions/AbstractEntity';
import { PackageEntity, PackageEntityBuildResponse } from '../package/packageEntity';
declare type OptionalTeacherEntityInitParams = {
    makePackageEntity: Promise<PackageEntity>;
};
declare type TeacherEntityBuildParams = {};
declare type TeacherEntityBuildResponse = {
    teachingLanguages: {
        code: string;
        level: string;
    }[];
    alsoSpeaks: {
        code: string;
        level: string;
    }[];
    introductionVideoUrl: string;
    applicationStatus: string;
    type: string;
    licenseUrl: string;
    priceData: {
        hourlyRate: number;
        currency: string;
    };
    settings: {
        isHidden: boolean;
        emailAlerts: {};
        payoutData: {
            email: string;
        };
    };
    tags: string[];
    lessonCount: number;
    studentCount: number;
    createdDate: Date;
    lastModifiedDate: Date;
    packages: PackageEntityBuildResponse[];
};
declare enum TEACHER_ENTITY_TYPE {
    LICENSED = "licensed",
    UNLICENSED = "unlicensed"
}
declare class TeacherEntity extends AbstractEntity<OptionalTeacherEntityInitParams, TeacherEntityBuildParams, TeacherEntityBuildResponse> {
    private _packageEntity;
    protected _buildTemplate: (buildParams: TeacherEntityBuildParams) => TeacherEntityBuildResponse;
    private _createPackages;
    protected _initTemplate: (optionalInitParams: OptionalTeacherEntityInitParams) => Promise<void>;
}
export { TeacherEntity, TeacherEntityBuildParams, TeacherEntityBuildResponse, TEACHER_ENTITY_TYPE };
