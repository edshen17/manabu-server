import { QueryStringHandler } from '../../usecases/utils/queryStringHandler/queryStringHandler';
import { AbstractValidator, JoiValidationObject } from './AbstractValidator';

type OptionalQueryValidatorInitParams = {
  makeQueryStringHandler: QueryStringHandler;
};

type QueryValidatorValidateParams = {
  query: {};
};

abstract class AbstractQueryValidator extends AbstractValidator<
  OptionalQueryValidatorInitParams,
  QueryValidatorValidateParams
> {
  protected _queryValidationSchema!: any;
  protected _queryStringHandler!: QueryStringHandler;

  protected _validateProps = (props: QueryValidatorValidateParams): JoiValidationObject => {
    const { query } = props;
    return this._queryValidationSchema.validate(query);
  };

  protected _initTemplate = (optionalInitParams: OptionalQueryValidatorInitParams): void => {
    const { makeQueryStringHandler } = optionalInitParams;
    this._queryStringHandler = makeQueryStringHandler;
  };
}

export { AbstractQueryValidator };
