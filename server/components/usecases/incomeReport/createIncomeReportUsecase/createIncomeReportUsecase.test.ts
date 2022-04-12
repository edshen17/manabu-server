import { expect } from 'chai';
import { makeCreateIncomeReportUsecase } from '.';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  CreateIncomeReportUsecase,
  CreateIncomeReportUsecaseResponse,
} from './createIncomeReportUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let createIncomeReportUsecase: CreateIncomeReportUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createIncomeReportUsecase = await makeCreateIncomeReportUsecase;
});

beforeEach(async () => {
  currentAPIUser = {
    userId: undefined,
    role: 'admin',
  };
  routeData = {
    params: {},
    body: {
      revenue: 100,
      wageExpense: -50,
      rentExpense: -10,
      advertisingExpense: 0,
      depreciationExpense: 0,
      suppliesExpense: 0,
      internetExpense: 0,
      startDate: new Date(),
      endDate: new Date(),
    },
    rawBody: {},
    query: {},
    endpointPath: '/admin/incomeReport',
    headers: {},
    cookies: {},
    req: {},
  };
});

describe('createIncomeReportUsecase', () => {
  describe('makeRequest', () => {
    const createIncomeReport = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createIncomeReportUsecaseRes = await createIncomeReportUsecase.makeRequest(
        controllerData
      );
      return createIncomeReportUsecaseRes;
    };
    const testIncomeReportError = async () => {
      let error;
      try {
        await createIncomeReport();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if body is invalid', async () => {
          routeData.body = {
            revenue: -10,
            createdDate: new Date(),
          };
          await testIncomeReportError();
        });
      });
      context('valid inputs', () => {
        const validResOutput = async (
          createIncomeReportUsecaseRes: CreateIncomeReportUsecaseResponse
        ): Promise<void> => {
          const { incomeReport } = createIncomeReportUsecaseRes;
          const { revenue, totalExpense, netIncome } = incomeReport;
          expect(revenue + totalExpense == netIncome).to.equal(true);
        };
        it('should return a new incomeReport', async () => {
          const createIncomeReportUsecaseRes = await createIncomeReport();
          await validResOutput(createIncomeReportUsecaseRes);
        });
        it('should return a new incomeReport', async () => {
          const createIncomeReportUsecaseRes = await createIncomeReport();
          const updatedIncomeReportUsecaseRes = await createIncomeReport();
          const updatedIncomeReport = updatedIncomeReportUsecaseRes.incomeReport;
          const originalIncomeReport = createIncomeReportUsecaseRes.incomeReport;
          expect(updatedIncomeReport.revenue - originalIncomeReport.revenue).to.equal(
            routeData.body.revenue
          );
          expect(updatedIncomeReport.wageExpense - originalIncomeReport.wageExpense).to.equal(
            routeData.body.wageExpense
          );
        });
      });
    });
  });
});
