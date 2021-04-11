const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BalanceTransactionSchema = new mongoose.Schema({
  userId: {
      type: Schema.Types.ObjectId, 
      required: true 
  },
  balanceChange: {
      type: Object, 
      required: true,
  },
  fees: {
    type: Object, 
    required: true,
  },
  description: {
    type: String, 
    required: true ,
  },
  date: { type: Date, required: false, default: Date.now, },
});

BalanceTransactionSchema.index({ userId: 1, });

const BalanceTransaction = mongoose.model('BalanceTransaction', BalanceTransactionSchema);
module.exports = BalanceTransaction;
