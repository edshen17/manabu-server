const dotenv = require('dotenv').config();
module.exports = {
    MongoURI: `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/users?retryWrites=true&w=majority`,
};
  