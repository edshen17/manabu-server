const mongoose = require('mongoose');
const makeUsersDb = require('./usersDb');
const User = require('../../models/User');
let dbHost;
if (process.env.NODE_ENV == 'production') {
    dbHost = 'users';
    paypalConfig.client_id = process.env.PAYPAL_CLIENT_ID;
    paypalConfig.client_secret = process.env.PAYPAL_CLIENT_SECRET;
    paypalConfig.mode = 'live';
}
else {
    dbHost = 'dev';
    // dbHost = 'users';
}

async function makeDb() {
    if (mongoose.connection.readyState != 1) {
        return await mongoose.connect(`mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        ignoreUndefined: true,
        useCreateIndex: true,
        readPreference: 'nearest',
        })
    }
}

const usersDb = makeUsersDb({ makeDb, User });
module.exports = { makeDb, usersDb };