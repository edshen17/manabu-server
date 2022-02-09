import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
declare type EntityInitParams<OptionalEntityInitParams> = RequiredEntityInitParams & OptionalEntityInitParams;
declare type RequiredEntityInitParams = {
    makeEntityValidator: AbstractEntityValidator;
};
interface IEntity<OptionalEntityInitParams, EntityBuildParams, EntityBuildResponse> {
    build: (buildParams: EntityBuildParams) => Promise<EntityBuildResponse> | EntityBuildResponse;
    init: (initParams: EntityInitParams<OptionalEntityInitParams>) => Promise<this>;
}
export { IEntity, EntityInitParams };
