const mongoose = require('mongoose');
const User = require('../../models/User');
let dbHost = 'dev';
if (mongoose.connection.readyState != 1) {
    mongoose.connect(`mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    ignoreUndefined: true,
    useCreateIndex: true,
    readPreference: 'nearest',
    })
}

const usersDb = User;
module.exports = usersDb;