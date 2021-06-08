"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTeacherBalanceDbService = exports.makeMinuteBankDbService = exports.makePackageTransactionDbService = exports.makeUserDbService = exports.makePackageDbService = exports.makeTeacherDbService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const usersDb_1 = require("./services/usersDb");
const teachersDb_1 = require("./services/teachersDb");
const packagesDb_1 = require("./services/packagesDb");
const User_1 = require("../../models/User");
const Teacher_1 = require("../../models/Teacher");
const Package_1 = require("../../models/Package");
const packageTransactionDb_1 = require("./services/packageTransactionDb");
const MinuteBank_1 = require("../../models/MinuteBank");
const PackageTransaction_1 = require("../../models/PackageTransaction");
const minuteBankDb_1 = require("./services/minuteBankDb");
const teacherBalanceDb_1 = require("./services/teacherBalanceDb");
const TeacherBalance_1 = require("../../models/TeacherBalance");
const mongod = new mongodb_memory_server_1.MongoMemoryServer();
const makeDb = async () => {
    if (mongoose_1.default.connection.readyState != 1) {
        let dbHost = 'users';
        let dbURI = `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=true&w=majority`;
        if (process.env.NODE_ENV != 'production') {
            dbURI = await mongod.getUri();
        }
        return await mongoose_1.default.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            ignoreUndefined: true,
            useCreateIndex: true,
            readPreference: 'nearest',
        });
    }
};
const makeTeacherDbService = new teachersDb_1.TeacherDbService({ teacherDb: Teacher_1.Teacher }).init({ makeDb });
exports.makeTeacherDbService = makeTeacherDbService;
const makePackageDbService = new packagesDb_1.PackageDbService({ packageDb: Package_1.Package }).init({ makeDb });
exports.makePackageDbService = makePackageDbService;
const makeUserDbService = new usersDb_1.UserDbService({
    userDb: User_1.User,
}).init({ makeDb, makeTeacherDbService, makePackageDbService });
exports.makeUserDbService = makeUserDbService;
const makePackageTransactionDbService = new packageTransactionDb_1.PackageTransactionDbService({
    packageTransactionDb: PackageTransaction_1.PackageTransaction,
}).init({ makeDb });
exports.makePackageTransactionDbService = makePackageTransactionDbService;
const makeMinuteBankDbService = new minuteBankDb_1.MinuteBankDbService({ minuteBankDb: MinuteBank_1.MinuteBank }).init({
    makeDb,
});
exports.makeMinuteBankDbService = makeMinuteBankDbService;
const makeTeacherBalanceDbService = new teacherBalanceDb_1.TeacherBalanceDbService({
    teacherBalanceDb: TeacherBalance_1.TeacherBalance,
}).init({ makeDb });
exports.makeTeacherBalanceDbService = makeTeacherBalanceDbService;
