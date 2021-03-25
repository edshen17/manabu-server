const mongoose = require('mongoose');
const MinuteBank = require('../../models/MinuteBank');
const Appointment = require('../../models/Appointment');
const PackageTransaction = require('../../models/PackageTransaction');
const sleep = ms => new Promise(res => setTimeout(res, ms));

// check packagetransactions
function terminatePackageTransactions() {
    PackageTransaction.updateMany({
            terminationDate: {
                $lte: new Date().toISOString()
            },
            isTerminated: false,
        }, {
            isTerminated: true,
            remainingReschedules: 0,
            remainingAppointments: 0,
        })
        .lean()
        .catch((err) => { console.log(err) })
}

function endAppointments() {
    Appointment.find({
            to: {
                $lte: new Date().toISOString()
            },
            isPast: false,
        })
        .lean()
        .then((appointments) => {
            if (appointments) {
                for (let i = 0; i < appointments.length; i++) {
                    PackageTransaction.findById(appointments[i].packageTransactionId, (err, packageTransaction) => {
                        if (err) console.log(err);
                        else if (packageTransaction) {
                            if (appointments[i].status == 'confirmed' || appointments[i].status == 'pending') {
                                const participants = {
                                    reservedBy: appointments[i].reservedBy,
                                    hostedBy: appointments[i].hostedBy
                                }
                                MinuteBank.findOne(participants)
                                    .then((searchBank) => {
                                        if (searchBank) {
                                            if (appointments[i].status == 'confirmed') { // add to minute bank only if confirmed
                                                searchBank.minuteBank = searchBank.minuteBank + 5;
                                                searchBank.lastUpdated = new Date();
                                                if (Math.floor((searchBank.minuteBank + 5) / packageTransaction.reservationLength) == 1) {
                                                    searchBank.minuteBank = 0;
                                                    packageTransaction.remainingAppointments = packageTransaction.remainingAppointments + 1;
                                                }
                                            } else if (appointments[i].status == 'pending') { // give reservedBy a lesson back
                                                packageTransaction.remainingAppointments = packageTransaction.remainingAppointments + 1;
                                                packageTransaction.save().catch((err) => { console.log(err)})
                                            }
                                        }
                                        searchBank.save().catch((err) => { console.log(err)})
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                            }
                        }
                    })
                    Appointment.findByIdAndUpdate(appointments[i]._id, {
                        isPast: true
                    }).lean().catch((err) => {
                        console.log(err)
                    })
                }
            }
        })
}

// TODO: email system

async function scheduler() {
    while (true) { // check forever
        await sleep(60 * 1000); // check appointments every minute
        terminatePackageTransactions();
        endAppointments()
    }
}

module.exports = scheduler;