"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUsecase = void 0;
const constants_1 = require("../../../../constants");
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
const emailHandler_1 = require("../../utils/emailHandler/emailHandler");
class CreateUserUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _userEntity;
    _packageTransactionEntity;
    _teacherEntity;
    _packageTransactionDbService;
    _emailHandler;
    _redirectUrlBuilder;
    _convertStringToObjectId;
    _graphDbService;
    _cookieHandler;
    _isSelf = async (props) => {
        return true;
    };
    _makeRequestTemplate = async (props) => {
        const { body, dbServiceAccessOptions, query } = props;
        const { state } = query || {};
        const { isTeacherApp } = state || {};
        const userEntity = await this._userEntity.build(body);
        let user = await this._createDbUser({ userEntity, dbServiceAccessOptions });
        if (isTeacherApp) {
            user = await this.handleTeacherCreation({ user, dbServiceAccessOptions });
        }
        if (!user.isEmailVerified) {
            this._sendVerificationEmail(userEntity);
            this._sendInternalEmail({ user, isTeacherApp });
        }
        const cookies = this._cookieHandler.splitLoginCookies(user);
        const redirectUrl = this._redirectUrlBuilder
            .host('client')
            .endpoint('/dashboard')
            .encodeQueryStringObj(query)
            .build();
        const usecaseRes = {
            user,
            cookies,
            redirectUrl,
        };
        return usecaseRes;
    };
    _createDbUser = async (props) => {
        const { userEntity, dbServiceAccessOptions } = props;
        const user = await this._dbService.insert({
            modelToInsert: userEntity,
            dbServiceAccessOptions,
        });
        await this._graphDbService.createUserNode({ user, dbServiceAccessOptions });
        return user;
    };
    handleTeacherCreation = async (props) => {
        const [joinedUserData] = await Promise.all([
            this._createTeacherData(props),
            this._createDbAdminPackageTransaction(props),
            this._createGraphAdminTeacherEdge(props),
        ]);
        return joinedUserData;
    };
    _createTeacherData = async (props) => {
        const { user, dbServiceAccessOptions } = props;
        const teacherData = await this._teacherEntity.build({});
        const savedDbTeacher = await this._dbService.findOneAndUpdate({
            searchQuery: { _id: user._id },
            updateQuery: {
                teacherData,
            },
            dbServiceAccessOptions,
        });
        return savedDbTeacher;
    };
    _createDbAdminPackageTransaction = async (props) => {
        const { user, dbServiceAccessOptions } = props;
        const modelToInsert = await this._packageTransactionEntity.build({
            hostedById: this._convertStringToObjectId(constants_1.MANABU_ADMIN_ID),
            reservedById: user._id,
            packageId: this._convertStringToObjectId(constants_1.MANABU_ADMIN_PKG_ID),
            lessonDuration: 60,
            remainingAppointments: 1,
            lessonLanguage: 'ja',
            isSubscription: false,
        });
        const newPackageTransaction = await this._packageTransactionDbService.insert({
            modelToInsert,
            dbServiceAccessOptions,
        });
        return newPackageTransaction;
    };
    _createGraphAdminTeacherEdge = async (props) => {
        const { user, dbServiceAccessOptions } = props;
        const query = `MATCH (teacher: User {_id: "${user._id}"}) MATCH (admin: User {_id:"${constants_1.MANABU_ADMIN_ID}"}) MERGE (admin)-[r: manages {since: "${new Date().toISOString()}"}]->(teacher)`;
        await this._graphDbService.graphQuery({ query, dbServiceAccessOptions });
    };
    _sendVerificationEmail = (userEntity) => {
        const { name, verificationToken, settings, email } = userEntity;
        const { locale } = settings;
        this._emailHandler.send({
            to: email,
            from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
            templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.EMAIL_VERIFICATION,
            data: {
                name,
                verificationToken,
            },
            locale,
        });
    };
    _sendInternalEmail = (props) => {
        const { user, isTeacherApp } = props;
        const userType = isTeacherApp ? 'teacher' : 'user';
        this._emailHandler.send({
            to: constants_1.MANABU_ADMIN_EMAIL,
            from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
            templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.INTERNAL_NEW_USER,
            data: {
                name: 'Admin',
                user,
                userType,
            },
        });
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeUserEntity, makePackageTransactionEntity, makeTeacherEntity, makePackageTransactionDbService, makeGraphDbService, makeEmailHandler, makeRedirectUrlBuilder, makeCookieHandler, convertStringToObjectId, } = optionalInitParams;
        this._userEntity = await makeUserEntity;
        this._packageTransactionEntity = await makePackageTransactionEntity;
        this._teacherEntity = await makeTeacherEntity;
        this._packageTransactionDbService = await makePackageTransactionDbService;
        this._graphDbService = await makeGraphDbService;
        this._emailHandler = await makeEmailHandler;
        this._redirectUrlBuilder = makeRedirectUrlBuilder;
        this._convertStringToObjectId = convertStringToObjectId;
        this._cookieHandler = await makeCookieHandler;
    };
}
exports.CreateUserUsecase = CreateUserUsecase;
