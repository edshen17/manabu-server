"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostUserUsecase = void 0;
const minuteBank_1 = require("../../entities/minuteBank");
const package_1 = require("../../entities/package");
const packageTransaction_1 = require("../../entities/packageTransaction");
const teacherBalance_1 = require("../../entities/teacherBalance");
const user_1 = require("../../entities/user/");
class PostUserUsecase {
    constructor() {
        this._sendVerificationEmail = (userInstance) => {
            const host = 'https://manabu.sg';
            const { name, verificationToken } = userInstance;
            this.emailHandler.sendEmail(userInstance.email, 'NOREPLY', 'Manabu email verification', 'verificationEmail', {
                name,
                host,
                verificationToken: verificationToken,
            });
        };
        this._sendInternalEmail = (userInstance, isTeacherApp) => {
            const userType = isTeacherApp ? 'teacher' : 'user';
            const { name, email } = userInstance;
            this.emailHandler.sendEmail('manabulessons@gmail.com', 'NOREPLY', `A new ${userType} signed up`, 'internalNewSignUpEmail', {
                name,
                email,
                userType,
            });
        };
        this._jwtToClient = (jwt, savedDbUser) => {
            const { role, name } = savedDbUser;
            const token = jwt.sign({
                _id: savedDbUser._id,
                role,
                name,
            }, process.env.JWT_SECRET, {
                expiresIn: 24 * 60 * 60 * 7,
            });
            return token;
        };
        this._insertUser = async (userInstance) => {
            const savedDbUser = await this.userDbService.insert({
                modelToInsert: userInstance,
                accessOptions: this.defaultAccessOptions,
            });
            return savedDbUser;
        };
        this._insertTeacher = async (savedDbUser) => {
            const userId = savedDbUser._id;
            const modelToInsert = user_1.makeTeacherEntity.build({ userId });
            const savedDbTeacher = await this.teacherDbService.insert({
                modelToInsert,
                accessOptions: this.defaultAccessOptions,
            });
            return savedDbTeacher;
        };
        this._insertTeacherPackages = async (savedDbUser) => {
            const defaultPackages = [
                { type: 'mainichi', lessonAmount: 22 },
                { type: 'moderate', lessonAmount: 12 },
                { type: 'light', lessonAmount: 5 },
            ];
            const savedDbPackages = [];
            defaultPackages.forEach(async (pkg) => {
                const packageProperties = {
                    hostedBy: savedDbUser._id,
                    lessonAmount: pkg.lessonAmount,
                    packageType: pkg.type,
                };
                const modelToInsert = package_1.makePackageEntity.build(packageProperties);
                const newPackage = await this.packageDbService.insert({
                    modelToInsert,
                    accessOptions: this.defaultAccessOptions,
                });
                savedDbPackages.push(newPackage);
            });
            return savedDbPackages;
        };
        this._insertAdminPackageTransaction = async (savedDbUser) => {
            const packageTransactionEntity = await packageTransaction_1.makePackageTransactionEntity;
            const modelToInsert = await packageTransactionEntity.build({
                hostedBy: process.env.MANABU_ADMIN_ID,
                reservedBy: savedDbUser._id,
                packageId: process.env.MANABU_ADMIN_PKG_ID,
                reservationLength: 60,
                remainingAppointments: 1,
                transactionDetails: {
                    currency: 'SGD',
                    subTotal: '0',
                    total: '0',
                },
            });
            const newPackageTransaction = this.packageTransactionDbService.insert({
                modelToInsert,
                accessOptions: this.defaultAccessOptions,
            });
            return newPackageTransaction;
        };
        this._insertAdminMinuteBank = async (savedDbUser) => {
            const minuteBankEntity = await minuteBank_1.makeMinuteBankEntity;
            const modelToInsert = await minuteBankEntity.build({
                hostedBy: process.env.MANABU_ADMIN_ID,
                reservedBy: savedDbUser._id,
            });
            const newMinuteBank = this.minuteBankDbService.insert({
                modelToInsert,
                accessOptions: this.defaultAccessOptions,
            });
            return newMinuteBank;
        };
        this._insertTeacherBalance = async (savedDbUser) => {
            const teacherBalanceEntity = await teacherBalance_1.makeTeacherBalanceEntity;
            const modelToInsert = await teacherBalanceEntity.build({
                userId: savedDbUser._id,
            });
            const newTeacherBalance = this.teacherBalanceDbService.insert({
                modelToInsert,
                accessOptions: this.defaultAccessOptions,
            });
            return newTeacherBalance;
        };
        this.makeRequest = async (controllerData) => {
            const { routeData } = controllerData;
            const { body } = routeData;
            const isTeacherApp = body.isTeacherApp;
            try {
                const userInstance = user_1.makeUserEntity.build(body);
                const savedDbUser = await this._insertUser(userInstance);
                if (isTeacherApp) {
                    await this._insertTeacher(savedDbUser);
                    await this._insertTeacherPackages(savedDbUser);
                    await this._insertAdminPackageTransaction(savedDbUser);
                    await this._insertAdminMinuteBank(savedDbUser);
                    await this._insertTeacherBalance(savedDbUser);
                }
                this._sendVerificationEmail(userInstance);
                if (process.env.NODE_ENV == 'production') {
                    this._sendInternalEmail(userInstance, isTeacherApp);
                }
                return {
                    token: this._jwtToClient(this.jwt, savedDbUser),
                    user: savedDbUser,
                };
            }
            catch (err) {
                throw err;
            }
        };
        this.init = async (services) => {
            const { makeUserDbService, makeTeacherDbService, makePackageDbService, makePackageTransactionDbService, makeMinuteBankDbService, makeTeacherBalanceDbService, jwt, emailHandler, } = services;
            this.userDbService = await makeUserDbService;
            this.teacherDbService = await makeTeacherDbService;
            this.packageDbService = await makePackageDbService;
            this.packageTransactionDbService = await makePackageTransactionDbService;
            this.minuteBankDbService = await makeMinuteBankDbService;
            this.teacherBalanceDbService = await makeTeacherBalanceDbService;
            this.jwt = jwt;
            this.emailHandler = emailHandler;
            return this;
        };
        this.defaultAccessOptions = {
            isProtectedResource: false,
            isCurrentAPIUserPermitted: true,
            currentAPIUserRole: 'user',
            isSelf: true,
        };
    }
}
exports.PostUserUsecase = PostUserUsecase;
