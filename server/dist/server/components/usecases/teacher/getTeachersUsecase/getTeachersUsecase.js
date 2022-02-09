"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeachersUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetTeachersUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _makeRequestTemplate = async (props) => {
        const { query } = props;
        const dbServiceAccessOptions = this._dbService.getBaseDbServiceAccessOptions();
        const teachers = await this._getTeachers({
            query,
            dbServiceAccessOptions,
        });
        return { teachers };
    };
    _getTeachers = async (props) => {
        const { query, dbServiceAccessOptions } = props;
        // const searchQuery = this._processQuery(query);
        const fallbackQuery = { page: 0, limit: 20 };
        const sort = { 'teacherData.approvalDate': 1 };
        const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
        const teachers = await this._dbService.find({
            searchQuery: {
                role: 'teacher',
                'teacherData.settings.isHidden': false,
                'teacherData.applicationStatus': 'approved',
            },
            dbServiceAccessOptions,
            paginationOptions,
        });
        return teachers;
    };
    _processQuery = (query) => {
        const { name, contactMethodName, contactMethodType, teachingLanguages, alsoSpeaks, teacherType, teacherTags, minPrice, maxPrice, packageTags, lessonDurations, } = query || {};
        const searchQuery = {
            role: 'teacher',
            'teacherData.settings.isHidden': false,
            'teacherData.applicationStatus': 'approved',
        };
        this._handleUserFilters({ name, contactMethodName, contactMethodType, searchQuery });
        this._handleTeacherFilters({
            teachingLanguages,
            alsoSpeaks,
            teacherType,
            teacherTags,
            minPrice,
            maxPrice,
            searchQuery,
        });
        this._handlePackageFilters({ packageTags, lessonDurations, searchQuery });
        return searchQuery;
    };
    _handleUserFilters = (props) => {
        const { name, contactMethodName, contactMethodType, searchQuery } = props;
        if (name) {
            searchQuery.$text = { $search: name };
        }
        if (contactMethodName) {
            searchQuery['contactMethods.methodName'] = {
                $in: contactMethodName,
            };
        }
        if (contactMethodType) {
            searchQuery['contactMethods.methodType'] = {
                $in: contactMethodType,
            };
        }
    };
    _handleTeacherFilters = (props) => {
        const { teachingLanguages, alsoSpeaks, teacherType, teacherTags, minPrice, maxPrice, searchQuery, } = props;
        if (teachingLanguages) {
            searchQuery['teacherData.teachingLanguages.language'] = {
                $in: teachingLanguages,
            };
        }
        if (alsoSpeaks) {
            searchQuery['teacherData.alsoSpeaks.language'] = {
                $in: alsoSpeaks,
            };
        }
        if (teacherType) {
            searchQuery['teacherData.teacherType'] = teacherType;
        }
        const priceObj = {};
        if (minPrice) {
            priceObj.$gte = minPrice;
            searchQuery['teacherData.priceData.hourlyRate'] = priceObj;
        }
        if (maxPrice) {
            priceObj.$lte = maxPrice;
            searchQuery['teacherData.priceData.hourlyRate'] = priceObj;
        }
        if (teacherTags) {
            searchQuery['teacherData.tags'] = {
                $in: teacherTags,
            };
        }
    };
    _handlePackageFilters = (props) => {
        const { packageTags, lessonDurations, searchQuery } = props;
        if (packageTags) {
            searchQuery['teacherData.packages.tags'] = {
                $in: packageTags,
            };
        }
        if (lessonDurations) {
            searchQuery['teacherData.packages.lessonDurations'] = {
                $in: lessonDurations,
            };
        }
    };
}
exports.GetTeachersUsecase = GetTeachersUsecase;
