const mongoose = require('mongoose');
const Appointment = require('../../models/Appointment');
const AvailableTime = require('../../models/AvailableTime');
const PackageTransaction = require('../../models/PackageTransaction');
const sleep = ms => new Promise(res => setTimeout(res, ms));
const dayjs = require('dayjs');

// check appointments
function refundSlots() {
    Appointment.find({ to: { $gte: dayjs().subtract(1, 'day').startOf('day').toISOString(), 
            $lte:  dayjs().subtract(1, 'day').endOf('day').toISOString()}}).then((appointments) => {
            for (let i = 0; i < appointments.length; i++) {
                if (appointments[i].status == 'pending') {
                    PackageTransaction.findById(appointments[i].packageTransactionId, (err, packageTransaction) => {
                        if (err) console.log(err);
                        else if (packageTransaction) {
                            PackageTransaction.findOneAndUpdate({ _id: packageTransaction._id }, {remainingAppointments: packageTransaction.remainingAppointments + 1 }).catch(() => {});
                        }
                    })
                }
            }
        }).catch((err) => {
            console.log(err);
        });
}

// check packagetransactions
function terminatePackageTransactions() {
    PackageTransaction.find({ terminationDate: { $gte: dayjs().subtract(1, 'day').startOf('day').toISOString(), 
            $lte:  dayjs().subtract(1, 'day').endOf('day').toISOString()}}).then((packageTransactions) => {
            for (let i = 0; i < packageTransactions.length; i++) {
                PackageTransaction.findOneAndUpdate({ _id: packageTransactions[i]._id }, 
                    {remainingAppointments: 0, remainingAppointments: 0 }).catch(() => {});
            }
        }).catch((err) => {
            console.log(err);
        });
}

// TODO: email system

async function scheduler() {
    while(true) {  // check forever
        await sleep(24 * 60 * 60 * 1000); // check appointments every day
        refundSlots();    
        terminatePackageTransactions(); 
      }
}

module.exports = scheduler;