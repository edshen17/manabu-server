import { joi } from '../../../../entities/utils/joi';
import { PackageTransactionCheckoutQueryValidator } from './packageTransactionCheckoutQueryValidator';

const makePackageTransactionCheckoutQueryValidator =
  new PackageTransactionCheckoutQueryValidator().init({ joi });

export { makePackageTransactionCheckoutQueryValidator };
