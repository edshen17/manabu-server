"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ENTITY_EMAIL_ALERT = exports.UserEntity = void 0;
const constants_1 = require("../../../constants");
const AbstractEntityValidator_1 = require("../../validators/abstractions/AbstractEntityValidator");
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
var USER_ENTITY_EMAIL_ALERT;
(function (USER_ENTITY_EMAIL_ALERT) {
    USER_ENTITY_EMAIL_ALERT["APPOINTMENT_CREATION"] = "appointmentCreation";
    USER_ENTITY_EMAIL_ALERT["APPOINTMENT_UPDATE"] = "appointmentUpdate";
    USER_ENTITY_EMAIL_ALERT["APPOINTMENT_START_REMINDER"] = "appointmentStartReminder";
    USER_ENTITY_EMAIL_ALERT["PACKAGE_TRANSACTION_CREATION"] = "packageTransactionCreation";
})(USER_ENTITY_EMAIL_ALERT || (USER_ENTITY_EMAIL_ALERT = {}));
exports.USER_ENTITY_EMAIL_ALERT = USER_ENTITY_EMAIL_ALERT;
class UserEntity extends AbstractEntity_1.AbstractEntity {
    _hashPassword;
    _cryptoRandomString;
    _signJwt;
    _teacherEntityValidator;
    _packageEntityValidator;
    _nGramHandler;
    _validate = (buildParams) => {
        const { teacherData, ...userData } = buildParams;
        this._entityValidator.validate({
            buildParams: userData,
            userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
            validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
        });
        if (teacherData) {
            const { packages, ...toValidateTeacherData } = teacherData;
            this._teacherEntityValidator.validate({
                buildParams: toValidateTeacherData,
                userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
            });
            packages.map((pkg) => {
                this._packageEntityValidator.validate({
                    buildParams: pkg,
                    userRole: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
                    validationMode: AbstractEntityValidator_1.ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
                });
            });
        }
    };
    _buildTemplate = (buildParams) => {
        const { name, email, password, profileImageUrl, contactMethods, teacherData } = buildParams || {};
        const encryptedPassword = this._encryptPassword(password);
        const verificationToken = this._createVerificationToken(name, email);
        const userEntity = {
            name,
            email,
            password: encryptedPassword,
            profileImageUrl: profileImageUrl || `https://avatars.dicebear.com/api/initials/${name}.svg`,
            profileBio: '',
            createdDate: new Date(),
            languages: [],
            region: '',
            timezone: '',
            lastOnlineDate: new Date(),
            role: 'user',
            settings: {
                currency: 'SGD',
                locale: 'en',
                emailAlerts: {
                    appointmentCreation: true,
                    appointmentUpdate: true,
                    appointmentStartReminder: true,
                    packageTransactionCreation: true,
                },
            },
            memberships: [],
            contactMethods: contactMethods || [],
            isEmailVerified: false,
            verificationToken,
            lastModifiedDate: new Date(),
            teacherData,
            nameNGrams: this._nGramHandler.createEdgeNGrams({ str: name, isPrefixOnly: false }),
            namePrefixNGrams: this._nGramHandler.createEdgeNGrams({ str: name, isPrefixOnly: true }),
            balance: {
                totalCurrent: 0,
                totalPending: 0,
                totalAvailable: 0,
                currency: constants_1.DEFAULT_CURRENCY,
            },
        };
        return userEntity;
    };
    _encryptPassword = (password) => {
        if (password) {
            return this._hashPassword(password, 10);
        }
        else {
            return undefined;
        }
    };
    _createVerificationToken = (name, email) => {
        const randToken = this._cryptoRandomString({ length: 15 });
        const secret = constants_1.JWT_SECRET;
        const TOKEN_EXPIRY_DATE = 24 * 60 * 60 * 7;
        const verificationToken = this._signJwt({ randToken, name, email }, secret, {
            expiresIn: TOKEN_EXPIRY_DATE,
        });
        return verificationToken;
    };
    _initTemplate = async (optionalInitParams) => {
        const { hashPassword, signJwt, cryptoRandomString, makeTeacherEntityValidator, makePackageEntityValidator, makeNGramHandler, } = optionalInitParams;
        this._hashPassword = hashPassword;
        this._signJwt = signJwt;
        this._cryptoRandomString = cryptoRandomString;
        this._teacherEntityValidator = makeTeacherEntityValidator;
        this._packageEntityValidator = makePackageEntityValidator;
        this._nGramHandler = makeNGramHandler;
    };
}
exports.UserEntity = UserEntity;
