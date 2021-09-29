import { joi } from '../../../entities/utils/joi';
import { PackageTransactionParamsValidator } from './packageTransactionParamsValidator';

const makePackageTransactionParamsValidator = new PackageTransactionParamsValidator().init({ joi });

export { makePackageTransactionParamsValidator };
