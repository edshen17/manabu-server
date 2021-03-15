const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Package = require('../models/Package');
const roles = require('./controller/roles').roles;

// verify transaction data from client
const verifyTransactionData = async (req, res, exchangeRate) => {
    if (!req.role) req.role = 'user';
    if (Object.keys(req.query).length === 0) req.query = req.body; // if using the paypal route/no query but data on body
    const { hostedBy, reservedBy, selectedPlan, selectedDuration, selectedSubscription, selectedPackageId } = req.query
    const teacher = await Teacher.findOne({
        userId: hostedBy,
    }).lean();

    if (!teacher) {
        return {
            status: 404,
            message: 'no teacher'
        }
    }
    else {
        const teacherUser = await User.findById(hostedBy).lean();
        const user =  await User.findById(reservedBy).lean();
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
                const subscriptionRes = ['yes', 'no']
                if (packageType == selectedPlan && packageDurations.includes(parseInt(selectedDuration)) && subscriptionRes.includes(selectedSubscription)) {
                    const teacherFilter = roles.can(req.role).readAny('teacherProfile')
                    teacher.userId = teacher.userId.toString()
                    const teacherData = teacherFilter.filter(teacher);
                    teacherData.profileImage = teacherUser.profileImage;
                    teacherData.name = teacherUser.name
                    return {
                        status: 200,
                        teacherData,
                        reservedBy: user._id,
                        selectedPlan,
                        selectedDuration,
                        selectedSubscription,
                        pkg,
                        exchangeRate,
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