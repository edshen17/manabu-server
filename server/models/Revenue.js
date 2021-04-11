const mongoose = require('mongoose');

const RevenueSchema = new mongoose.Schema({
  revenue: { // user id (admin/teacher)
      type: Object, 
      required: true 
  },
  date: { // date of sale
    type: String,
    required: true,
  },
});

const Revenue = mongoose.model('Revenue', RevenueSchema);
module.exports = Revenue;
