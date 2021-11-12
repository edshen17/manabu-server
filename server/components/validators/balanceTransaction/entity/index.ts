import { joi } from '../../../entities/utils/joi';
import { BalanceTransactionEntityValidator } from './balanceTransactionEntityValidator';

const makeBalanceTransactionEntityValidator = new BalanceTransactionEntityValidator().init({ joi });

export { makeBalanceTransactionEntityValidator };
