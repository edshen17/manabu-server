import { joi } from '../../../../entities/utils/joi';
import { PackageTransactionCheckoutEntityValidator } from './packageTransactionCheckoutEntityValidator';

const makePackageTransactionCheckoutEntityValidator =
  new PackageTransactionCheckoutEntityValidator().init({ joi });

export { makePackageTransactionCheckoutEntityValidator };
