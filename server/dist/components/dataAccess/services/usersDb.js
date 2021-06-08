"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDbService = void 0;
const CommonDbOperations_1 = require("../abstractions/CommonDbOperations");
class UserDbService extends CommonDbOperations_1.CommonDbOperations {
    constructor(props) {
        super(props.userDb);
        this._joinUserTeacherPackage = async (user, accessOptions) => {
            const userCopy = JSON.parse(JSON.stringify(user));
            const _id = user._id;
            const teacher = await this.teacherDbService.findById({
                _id,
                accessOptions,
            });
            const packages = await this.packageDbService.find({
                searchQuery: { hostedBy: _id },
                accessOptions,
            });
            if (teacher) {
                userCopy.teacherAppPending = !teacher.isApproved;
                userCopy.teacherData = teacher;
                userCopy.teacherData.packages = packages;
            }
            return userCopy;
        };
        this._returnJoinedUser = async (accessOptions, asyncCallback) => {
            const user = await this._grantAccess(accessOptions, asyncCallback);
            if (user) {
                return await this._joinUserTeacherPackage(user, accessOptions);
            }
        };
        this._dbReturnTemplate = async (accessOptions, asyncCallback) => {
            return await this._returnJoinedUser(accessOptions, asyncCallback);
        };
        this.init = async (props) => {
            const { makeDb, makeTeacherDbService, makePackageDbService } = props;
            await makeDb();
            this.teacherDbService = await makeTeacherDbService;
            this.packageDbService = await makePackageDbService;
            return this;
        };
        this.defaultSelectOptions = {
            defaultSettings: {
                email: 0,
                password: 0,
                verificationToken: 0,
                settings: 0,
            },
            adminSettings: {
                password: 0,
                verificationToken: 0,
            },
            isSelfSettings: {
                email: 0,
                password: 0,
                verificationToken: 0,
            },
        };
    }
}
exports.UserDbService = UserDbService;
