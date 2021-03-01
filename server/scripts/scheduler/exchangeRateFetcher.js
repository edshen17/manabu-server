const axios = require('axios')

const fetchExchangeRate = async () => {
    const res = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${process.env.OPEN_EXCHANGE_RATE_API_KEY}`).catch((err) => { throw err });
    return res.data.rates;
}

module.exports.fetchExchangeRate = fetchExchangeRate;