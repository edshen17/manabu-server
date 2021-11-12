import { makeBalanceTransactionEntityValidator } from '../../validators/balanceTransaction/entity';
import { BalanceTransactionEntity } from './balanceTransactionEntity';

const makeBalanceTransactionEntity = new BalanceTransactionEntity().init({
  makeEntityValidator: makeBalanceTransactionEntityValidator,
});

export { makeBalanceTransactionEntity };
