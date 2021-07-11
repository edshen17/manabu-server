import { PackageTransactionEntityValidator } from './packageTransactionEntityValidator';
import { extendedJoi as joi } from '../../utils/joi/extendedJoi';

const makePackageTransactionEntityValidator = new PackageTransactionEntityValidator().init({ joi });

export { makePackageTransactionEntityValidator };
