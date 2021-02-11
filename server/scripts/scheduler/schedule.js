const mongoose = require('mongoose');
const MinuteBank = require('../../models/MinuteBank');
const Appointment = require('../../models/Appointment');
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
                    if (appointments[i].status == 'confirmed' || appointments[i].status == 'pending') {
                        const participants = {reservedBy: appointments[i].reservedBy, hostedBy: appointments[i].hostedBy}
                        MinuteBank.findOne(participants).then((searchBank) => {
                            if (searchBank) {
                                const updatePackageTransaction = { isTerminated: true, };
                                const updateMinuteBank = { minuteBank: searchBank.minuteBank + 5 }
                                if (appointments[i].status == 'confirmed') { // add to minute bank only if confirmed
                                    if (Math.floor((searchBank.minuteBank + 5) / packageTransaction.reservationLength) == 1) {
                                        updatePackageTransaction.remainingAppointments = packageTransaction.remainingAppointments + 1;
                                        updateMinuteBank.minuteBank = 0;
                                    }
                                    MinuteBank.findOneAndUpdate(participants, updateMinuteBank).catch((err) => {console.log(err)})
                                } else if (appointments[i].status == 'pending') { // give reservedBy a lesson back
                                    updatePackageTransaction.remainingAppointments = packageTransaction.remainingAppointments + 1;
                                }

                                PackageTransaction.findOneAndUpdate({ _id: packageTransaction._id }, 
                                    updatePackageTransaction).catch((err) => {console.log(err)})
                            }
                        }).catch((err) => {console.log(err)})   
                    }
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
        await sleep(1000); // check appointments every minute TODO
        terminatePackageTransactions(); 
        endAppointments()
      }
}

module.exports = scheduler;