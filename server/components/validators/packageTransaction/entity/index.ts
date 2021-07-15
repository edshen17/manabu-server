import { PackageTransactionEntityValidator } from './packageTransactionEntityValidator';
import { joi } from '../../../entities/utils/joi';

const makePackageTransactionEntityValidator = new PackageTransactionEntityValidator().init({ joi });

export { makePackageTransactionEntityValidator };
