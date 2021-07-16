import { AbstractValidator, JoiValidationObject } from './AbstractValidator';

type OptionalQueryValidatorInitParams = {};

type QueryValidatorValidateParams = {
  query: {};
};

abstract class AbstractQueryValidator extends AbstractValidator<
  OptionalQueryValidatorInitParams,
  QueryValidatorValidateParams
> {
  protected _queryValidationSchema!: any;

  protected _validateProps = (props: QueryValidatorValidateParams): JoiValidationObject => {
    const { query } = props;
    return this._queryValidationSchema.validate(query);
  };
}

export { AbstractQueryValidator };
