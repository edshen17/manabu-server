import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { TeacherDbServiceResponse } from '../../../dataAccess/services/teacher/teacherDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetTeachersUsecaseInitParams = {};
type GetTeachersUsecaseResponse = { teachers: JoinedUserDoc[] };

class GetTeachersUsecase extends AbstractGetUsecase<
  OptionalGetTeachersUsecaseInitParams,
  GetTeachersUsecaseResponse,
  TeacherDbServiceResponse
> {
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetTeachersUsecaseResponse> => {
    const { query } = props;
    const dbServiceAccessOptions = this._dbService.getBaseDbServiceAccessOptions();
    const teachers = await this._getTeachers({
      query,
      dbServiceAccessOptions,
    });
    return { teachers };
  };

  private _getTeachers = async (props: {
    query: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc[]> => {
    const { query, dbServiceAccessOptions } = props;
    const searchQuery = this._processQuery(query);
    const fallbackQuery = { page: 0, limit: 20 };
    const sort = { 'teacherData.approvalDate': 1 };
    const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
    const teachers = <JoinedUserDoc[]>await this._dbService.find({
      searchQuery,
      dbServiceAccessOptions,
      paginationOptions,
    });
    return teachers;
  };

  private _processQuery = (query: StringKeyObject): StringKeyObject => {
    const {
      name,
      contactMethodName,
      contactMethodType,
      teachingLanguages,
      alsoSpeaks,
      teacherType,
      teacherTags,
      minPrice,
      maxPrice,
      packageTags,
      lessonDurations,
    } = query || {};
    const searchQuery: StringKeyObject = {
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

  private _handleUserFilters = (props: {
    name?: string;
    contactMethodName?: string;
    contactMethodType?: string;
    searchQuery: StringKeyObject;
  }) => {
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

  private _handleTeacherFilters = (props: {
    teachingLanguages?: string[];
    alsoSpeaks?: string[];
    teacherType?: string;
    teacherTags?: string[];
    minPrice?: number;
    maxPrice?: number;
    searchQuery: StringKeyObject;
  }) => {
    const {
      teachingLanguages,
      alsoSpeaks,
      teacherType,
      teacherTags,
      minPrice,
      maxPrice,
      searchQuery,
    } = props;
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
    const priceObj: StringKeyObject = {};
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

  private _handlePackageFilters = (props: {
    packageTags?: string[];
    lessonDurations?: number[];
    searchQuery: StringKeyObject;
  }) => {
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

export { GetTeachersUsecase, GetTeachersUsecaseResponse };
