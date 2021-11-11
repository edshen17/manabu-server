const mongoose = require('mongoose');
const MinuteBank = require('../../models/MinuteBank');
const Appointment = require('../../models/Appointment');
const PackageTransaction = require('../../models/PackageTransaction');
const TeacherBalance = require('../../models/TeacherBalance');
const BalanceTransaction = require('../../models/BalanceTransaction');
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// check packagetransactions
function terminatePackageTransactions() {
  PackageTransaction.find({
    terminationDate: {
      $lte: new Date().toISOString(),
    },
    isTerminated: false,
  }).then((packageTransactions) => {
    packageTransactions.forEach((packageTransaction) => {
      packageTransaction.isTerminated = true;
      packageTransaction.remainingReschedules = 0;
      packageTransaction.remainingAppointments = 0;
      packageTransaction.save().catch((err) => {
        console.log(err);
      });
    });
  });
}

async function scheduler() {
  while (true) {
    // check forever
    await sleep(60 * 1000); // check every minute
    terminatePackageTransactions();
  }
}

module.exports = scheduler;
