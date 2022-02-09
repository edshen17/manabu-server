"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEACHER_ENTITY_TYPE = exports.TeacherEntity = void 0;
const constants_1 = require("../../../constants");
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
const packageEntity_1 = require("../package/packageEntity");
var TEACHER_ENTITY_TYPE;
(function (TEACHER_ENTITY_TYPE) {
    TEACHER_ENTITY_TYPE["LICENSED"] = "licensed";
    TEACHER_ENTITY_TYPE["UNLICENSED"] = "unlicensed";
})(TEACHER_ENTITY_TYPE || (TEACHER_ENTITY_TYPE = {}));
exports.TEACHER_ENTITY_TYPE = TEACHER_ENTITY_TYPE;
class TeacherEntity extends AbstractEntity_1.AbstractEntity {
    _packageEntity;
    _buildTemplate = (buildParams) => {
        const teacherEntity = {
            teachingLanguages: [],
            alsoSpeaks: [],
            introductionVideoUrl: '',
            applicationStatus: 'pending',
            settings: {
                isHidden: false,
                emailAlerts: {},
                payoutData: { email: '' },
            },
            type: TEACHER_ENTITY_TYPE.UNLICENSED,
            licenseUrl: '',
            priceData: { hourlyRate: 30, currency: constants_1.DEFAULT_CURRENCY },
            tags: [],
            lessonCount: 0,
            studentCount: 0,
            createdDate: new Date(),
            lastModifiedDate: new Date(),
            packages: this._createPackages(),
        };
        return teacherEntity;
    };
    _createPackages = () => {
        const trialPackage = this._packageEntity.build({
            lessonAmount: 1,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT,
            name: packageEntity_1.PACKAGE_ENTITY_NAME.TRIAL,
            isOffering: true,
            lessonDurations: [30, 60],
        });
        const lightPackage = this._packageEntity.build({
            lessonAmount: 5,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT,
            name: packageEntity_1.PACKAGE_ENTITY_NAME.LIGHT,
            isOffering: true,
            lessonDurations: [30, 60],
        });
        const moderatePackage = this._packageEntity.build({
            lessonAmount: 12,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT,
            name: packageEntity_1.PACKAGE_ENTITY_NAME.MODERATE,
            isOffering: true,
            lessonDurations: [30, 60],
        });
        const mainichiPackage = this._packageEntity.build({
            lessonAmount: 20,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.DEFAULT,
            name: packageEntity_1.PACKAGE_ENTITY_NAME.MAINICHI,
            isOffering: true,
            lessonDurations: [30, 60],
        });
        const customPackage1 = this._packageEntity.build({
            lessonAmount: 10,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.CUSTOM,
            name: `${packageEntity_1.PACKAGE_ENTITY_NAME.CUSTOM} 1`,
            isOffering: false,
            lessonDurations: [30, 60],
        });
        const customPackage2 = this._packageEntity.build({
            lessonAmount: 11,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.CUSTOM,
            name: `${packageEntity_1.PACKAGE_ENTITY_NAME.CUSTOM} 2`,
            isOffering: false,
            lessonDurations: [30, 60],
        });
        const customPackage3 = this._packageEntity.build({
            lessonAmount: 12,
            type: packageEntity_1.PACKAGE_ENTITY_TYPE.CUSTOM,
            name: `${packageEntity_1.PACKAGE_ENTITY_NAME.CUSTOM} 3`,
            isOffering: false,
            lessonDurations: [30, 60],
        });
        return [
            trialPackage,
            lightPackage,
            moderatePackage,
            mainichiPackage,
            customPackage1,
            customPackage2,
            customPackage3,
        ];
    };
    _initTemplate = async (optionalInitParams) => {
        const { makePackageEntity } = optionalInitParams;
        this._packageEntity = await makePackageEntity;
    };
}
exports.TeacherEntity = TeacherEntity;
