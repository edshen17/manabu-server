"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDbService = void 0;
const AbstractDbService_1 = require("../../abstractions/AbstractDbService");
class UserDbService extends AbstractDbService_1.AbstractDbService {
    _comparePassword;
    _getDbServiceModelViews = () => {
        return {
            defaultView: {
                email: 0,
                password: 0,
                verificationToken: 0,
                settings: 0,
                contactMethods: 0,
                isEmailVerified: 0,
                nameNGrams: 0,
                namePrefixNGrams: 0,
                balance: 0,
                'teacherData.licenseUrl': 0,
                'teacherData.settings': 0,
            },
            adminView: {
                password: 0,
                verificationToken: 0,
                nameNGrams: 0,
                namePrefixNGrams: 0,
            },
            selfView: {
                password: 0,
                verificationToken: 0,
                nameNGrams: 0,
                namePrefixNGrams: 0,
            },
            overrideView: {},
        };
    };
    authenticateUser = async (props) => {
        const { searchQuery, password } = props;
        const overrideUser = await this.findOne({
            searchQuery,
            dbServiceAccessOptions: this.getOverrideDbServiceAccessOptions(),
        });
        if (!overrideUser) {
            return undefined;
        }
        if (!overrideUser.password) {
            throw new Error('It seems that you signed up previously through a third-party service like Google.');
        }
        const isPasswordValid = this._comparePassword(password, overrideUser.password);
        if (isPasswordValid) {
            const user = await this.findOne({
                searchQuery,
                dbServiceAccessOptions: this.getSelfDbServiceAccessOptions(),
            });
            return user;
        }
        else {
            throw new Error('Username or password incorrect.');
        }
    };
    _initTemplate = async (optionalDbServiceInitParams) => {
        const { comparePassword } = optionalDbServiceInitParams;
        this._comparePassword = comparePassword;
    };
}
exports.UserDbService = UserDbService;
