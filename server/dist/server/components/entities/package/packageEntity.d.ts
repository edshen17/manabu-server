import { AbstractEntity } from '../abstractions/AbstractEntity';
declare type OptionalPackageEntityInitParams = {};
declare type PackageEntityBuildParams = {
    lessonAmount: number;
    description?: string;
    tags?: string[];
    isOffering: boolean;
    type: string;
    lessonDurations: number[];
    name: string;
};
declare type PackageEntityBuildResponse = {
    lessonAmount: number;
    isOffering: boolean;
    type: string;
    name: string;
    description?: string;
    tags?: string[];
    lessonDurations: number[];
    createdDate: Date;
    lastModifiedDate: Date;
};
declare enum PACKAGE_ENTITY_NAME {
    TRIAL = "trial",
    LIGHT = "light",
    MODERATE = "moderate",
    MAINICHI = "mainichi",
    CUSTOM = "custom"
}
declare enum PACKAGE_ENTITY_TYPE {
    DEFAULT = "default",
    CUSTOM = "custom"
}
declare class PackageEntity extends AbstractEntity<OptionalPackageEntityInitParams, PackageEntityBuildParams, PackageEntityBuildResponse> {
    protected _buildTemplate: (buildParams: PackageEntityBuildParams) => PackageEntityBuildResponse;
}
export { PackageEntity, PackageEntityBuildResponse, PackageEntityBuildParams, PACKAGE_ENTITY_NAME, PACKAGE_ENTITY_TYPE, };
