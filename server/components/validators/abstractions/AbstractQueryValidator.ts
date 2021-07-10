import { QueryStringHandler } from '../../usecases/utils/queryStringHandler/queryStringHandler';
import { AbstractValidator, JoiValidationObject } from './AbstractValidator';

type OptionalQueryValidatorInitParams = {
  makeQueryStringHandler: QueryStringHandler;
};

type QueryValidatorValidateParams = {
  encodedQueryStringObj: {};
};

abstract class AbstractQueryValidator extends AbstractValidator<
  OptionalQueryValidatorInitParams,
  QueryValidatorValidateParams
> {
  protected _queryValidationSchema!: any;
  protected _queryStringHandler!: QueryStringHandler;
  protected _validateProps = (props: QueryValidatorValidateParams): JoiValidationObject => {
    const { encodedQueryStringObj } = props;
    const decodedQueryStringObj =
      this._queryStringHandler.decodeQueryStringObj(encodedQueryStringObj);
    return this._queryValidationSchema.validate(decodedQueryStringObj);
  };
  protected _initTemplate = (optionalInitParams: OptionalQueryValidatorInitParams): void => {
    const { makeQueryStringHandler } = optionalInitParams;
    this._queryStringHandler = makeQueryStringHandler;
  };
}

export { AbstractQueryValidator };
