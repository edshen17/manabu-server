import { joi } from '../../../entities/utils/joi';
import { PackageTransactionQueryValidator } from './packageTransactionQueryValidator';

const makePackageTransactionQueryValidator = new PackageTransactionQueryValidator().init({ joi });

export { makePackageTransactionQueryValidator };
