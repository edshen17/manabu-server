import { joi } from '../../../entities/utils/joi';
import { PackageTransactionEntityValidator } from './packageTransactionEntityValidator';

const makePackageTransactionEntityValidator = new PackageTransactionEntityValidator().init({ joi });

export { makePackageTransactionEntityValidator };
