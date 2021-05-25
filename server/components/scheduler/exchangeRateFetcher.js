const axios = require('axios');
const fetchExchangeRate = async () => {
  let apiKey;
  if (process.env.NODE_ENV == 'production') {
    apiKey = process.env.OPEN_EXCHANGE_RATE_API_KEY;
  } else {
    apiKey = process.env.OPEN_EXCHANGE_RATE_API_KEY_DEV;
  }
  const res = await axios
    .get(`https://openexchangerates.org/api/latest.json?app_id=5b6442ada9d84c03a929e38f68fc0a64`)
    .catch((err) => {
      throw err;
    });
  return res.data.rates;
};

module.exports.fetchExchangeRate = fetchExchangeRate;
