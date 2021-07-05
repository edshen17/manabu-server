interface IEntityValidator {
  validate: (buildParams: {}) => {} | Error;
  init: (initParams: { joi: any }) => this;
}

export { IEntityValidator };
