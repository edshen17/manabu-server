const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Package = require('../models/Package').Package;
const roles = require('./controller/roles').roles;
const fx = require('money');

// verify transaction data from client
const verifyTransactionData = async (req, res, exchangeRate) => {
    if (!req.role) req.role = 'user';
    if (Object.keys(req.query).length === 0) req.query = req.body; // if using the paypal route/no query but data on body
    fx.rates = exchangeRate;
    const { hostedBy, reservedBy, selectedPlan, selectedDuration, selectedSubscription, selectedPackageId, selectedLanguage, selectedMethod } = req.query
    const teacherData = await Teacher.findOne({
        userId: hostedBy,
    }, { _id: 0, licensePath: 0, }).lean();

    if (!teacherData) {
        return {
            status: 404,
            message: 'no teacher'
        }
    }
    else {
        const options = {
            password: 0,
            settings: 0,
            profileBio: 0,
            lastOnline: 0,
            dateRegistered: 0,
          }

        const teacherUserData = await User.findById(hostedBy, options).lean().catch((err) => {err});
        const user =  await User.findById(reservedBy, options).lean().catch((err) => {err});
        if (!user) {
            return {
                status: 404,
                message: 'no user'
            }
        }
        else {
            const pkg = await Package.findById(selectedPackageId).lean()
            if (!pkg) {
                return {
                    status: 404,
                    message: 'no package found'
                }
            }

            else {
                const { packageType, packageDurations } = pkg
                const subscriptionRes = ['yes', 'no'];
                const isTeachingLanguage = teacherData.teachingLanguages.findIndex((lang) => { return lang.language == selectedLanguage }) != -1;
                if (packageType == selectedPlan && packageDurations.includes(parseInt(selectedDuration)) && subscriptionRes.includes(selectedSubscription) && isTeachingLanguage) {
                    let transactionPrice;
                    let subTotal;
                    const paymentMethods = {
                        'PayPal': .03,
                        'Credit / Debit Card': 0,
                    }

                    if (selectedMethod) { // payment check
                        subTotal = fx.convert(pkg.priceDetails.hourlyPrice * (parseInt(selectedDuration)/60) * pkg.lessonAmount, {from: pkg.priceDetails.currency, to: 'SGD'})
                        transactionPrice = fx.convert((pkg.priceDetails.hourlyPrice * (parseInt(selectedDuration)/60) * pkg.lessonAmount) * (1 + paymentMethods[selectedMethod]), {from: pkg.priceDetails.currency, to: 'SGD'})
                    } else { // pre payment
                        transactionPrice = fx.convert(pkg.priceDetails.hourlyPrice * (parseInt(selectedDuration)/60) * pkg.lessonAmount, {from: pkg.priceDetails.currency, to: 'SGD'})
                        subTotal = transactionPrice;

                    }
                    return {
                        status: 200,
                        teacherData,
                        reservedBy,
                        selectedPlan,
                        selectedDuration,
                        selectedSubscription,
                        selectedLanguage,
                        pkg,
                        exchangeRate,
                        transactionPrice,
                        selectedMethod,
                        subTotal,
                        teacherUserData,
                        userData: user,
                    }
                } else {
                    return {
                        status: 500,
                        message: 'invalid transaction'
                    }
                }
            }
        }
    }
}
    





module.exports = verifyTransactionData;