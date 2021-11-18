import { makeBalanceTransactionEntityValidator } from '../../validators/balanceTransaction/entity';
import { BalanceTransactionEntity } from './balanceTransactionEntity';
const currency = require('currency.js');

const makeBalanceTransactionEntity = new BalanceTransactionEntity().init({
  makeEntityValidator: makeBalanceTransactionEntityValidator,
  currency,
});

export { makeBalanceTransactionEntity };
