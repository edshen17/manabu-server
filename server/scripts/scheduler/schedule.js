const mongoose = require('mongoose');
const Appointment = require('../../models/Appointment');
const AvailableTime = require('../../models/AvailableTime');
const PackageTransaction = require('../../models/PackageTransaction');
const sleep = ms => new Promise(res => setTimeout(res, ms));

// check packagetransactions
function terminatePackageTransactions() {
    PackageTransaction.updateMany({ terminationDate: { 
        $lte:  new Date().toISOString() }, isTerminated: false,}, { isTerminated: true })
    .catch((err) => {
        console.log(err);
    });
}

function endAppointments() {
    Appointment.find({ to: { $lte:  new Date().toISOString() }, isPast: false,}).then((appointments) => {
        for (let i = 0; i < appointments.length; i++) {
            PackageTransaction.findById(appointments[i].packageTransactionId, (err, packageTransaction) => {
                if (err) console.log(err);
                else if (packageTransaction) {
                    PackageTransaction.findOneAndUpdate({ _id: packageTransaction._id }, 
                        { isTerminated: true, minuteBank: packageTransaction.minuteBank + 5,
                            remainingAppointments: packageTransaction.remainingAppointments + 1  }).catch((err) => {console.log(err)})
                }
            })

            Appointment.findByIdAndUpdate(appointments[i]._id, { isPast: true }).catch((err) => {console.log(err)})
        }
    }).catch((err) => {
        console.log(err);
    });
}

// TODO: email system

async function scheduler() {
    while(true) {  // check forever
        await sleep(60 * 1000); // check appointments every minute
        terminatePackageTransactions(); 
        endAppointments()
      }
}

module.exports = scheduler;