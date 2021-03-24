const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PackageTransaction = require('./PackageTransaction');
const User = require('./User');
const AppointmentSchema = new mongoose.Schema({
    hostedBy: { // user id (admin/teacher)
        type: Schema.Types.ObjectId,
        required: true
    },
    reservedBy: { // user id (student/teacher)
        type: Schema.Types.ObjectId,
        required: true
    },
    packageTransactionId: { // transaction id
        type: Schema.Types.ObjectId,
        required: true,
    },
    from: { // iso format of date (start time)
        type: String,
        required: true,
    },
    to: { // (end time)
        type: String,
        required: true,
    },
    isPast: {
        type: Boolean,
        default: false,
    },
    status: { // status of lesson (confirmed, pending, cancelled)
        type: String,
        default: 'pending',
        enum: ['confirmed', 'pending', 'cancelled']
    },
    cancellationReason: {
        type: String,
        required: false,
    },
    packageTransactionData: {
        type: Object,
        required: false,
    },
    locationData: {
        type: Object,
        default: {},
    },
});

AppointmentSchema.pre('save', async function() {
    try {
        const packageTransactionData = await PackageTransaction.findById(this.packageTransactionId, {
            methodData: 0,
            remainingReschedules: 0,
            hostedBy: 0,
            packageId: 0,
            reservedBy: 0,
            remainingAppointments: 0,
        }).lean().catch((err) => {});;
        const hostedByData = await User.findById(this.hostedBy).lean().catch((err) => {});
        const reservedByData = await User.findById(this.reservedBy).lean().catch((err) => {});
        const digitalLocation = hostedByData.commMethods.filter((method) => {
            return method.method == reservedByData.commMethods[0].method
        })
        let locationData;
        if (digitalLocation.length == 0) { // no common method
            digitalLocation.push(hostedByData.commMethods[0]);
            locationData = {
                method: digitalLocation[0].method,
                hostedByMethodId: digitalLocation[0].id,
                online: true,
            }
        }

        else {
            locationData = {
                method: digitalLocation[0].method,
                hostedByMethodId: digitalLocation[0].id,
                reservedByMethodId: reservedByData.commMethods[0].id,
                online: true,
            }
        }

        this.set({
            packageTransactionData,
            locationData
        });
    } catch (err) {
        console.log(err);
    }

})


const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;