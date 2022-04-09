import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerData, RouteData } from '../../abstractions/IUsecase';
import { CreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { ControllerDataBuilder } from '../controllerDataBuilder/controllerDataBuilder';

class FakePackageTransactionCheckoutTokenHandler {
  private _fakeDbUserFactory!: FakeDbUserFactory;
  private _fakeDbAvailableTimeFactory!: FakeDbAvailableTimeFactory;
  private _controllerDataBuilder!: ControllerDataBuilder;
  private _createPackageTransactionCheckoutUsecase!: CreatePackageTransactionCheckoutUsecase;
  private _dayjs!: any;

  public createTokenData = async (): Promise<{
    token: string;
    currentAPIUser: CurrentAPIUser;
  }> => {
    const routeData = await this._createRouteData();
    const currentAPIUser = await this._createCurrentAPIUser();
    const controllerData = this._createControllerData({ routeData, currentAPIUser });
    const createPackageTransactionCheckoutRes =
      await this._createPackageTransactionCheckoutUsecase.makeRequest(controllerData);
    const { token } = createPackageTransactionCheckoutRes;
    const tokenData = { token, currentAPIUser };
    return tokenData;
  };

  private _createCurrentAPIUser = async (): Promise<CurrentAPIUser> => {
    const fakeUser = await this._fakeDbUserFactory.createFakeDbUser();
    const currentAPIUser = {
      userId: fakeUser._id,
      role: fakeUser.role,
    };
    return currentAPIUser;
  };

  private _createRouteData = async (): Promise<RouteData> => {
    const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacher();
    const startDate = this._dayjs().toDate();
    const endDate = this._dayjs().add(1, 'hour').toDate();
    const fakeAvailableTime = await this._fakeDbAvailableTimeFactory.createFakeDbData({
      hostedById: fakeTeacher._id,
      startDate,
      endDate,
    });
    const createPackageTransactionCheckoutRouteData = {
      rawBody: {},
      headers: {},
      params: {},
      body: {
        teacherId: fakeTeacher.teacherData!._id,
        packageId: fakeTeacher.teacherData!.packages[0]._id,
        lessonDuration: 60,
        lessonLanguage: 'ja',
        timeslots: [{ startDate, endDate }],
      },
      query: {
        paymentGateway: 'paynow',
      },
      endpointPath: '',
      cookies: {},
    };
    return createPackageTransactionCheckoutRouteData;
  };

  private _createControllerData = (props: {
    routeData: RouteData;
    currentAPIUser: CurrentAPIUser;
  }): ControllerData => {
    const { routeData, currentAPIUser } = props;
    const createPackageTransactionCheckoutControllerData = this._controllerDataBuilder
      .routeData(routeData)
      .currentAPIUser(currentAPIUser)
      .build();
    return createPackageTransactionCheckoutControllerData;
  };

  public init = async (initParams: {
    makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
    makeControllerDataBuilder: ControllerDataBuilder;
    makeCreatePackageTransactionCheckoutUsecase: Promise<CreatePackageTransactionCheckoutUsecase>;
    makeFakeDbAvailableTimeFactory: Promise<FakeDbAvailableTimeFactory>;
    dayjs: any;
  }): Promise<this> => {
    const {
      makeFakeDbUserFactory,
      makeControllerDataBuilder,
      makeCreatePackageTransactionCheckoutUsecase,
      makeFakeDbAvailableTimeFactory,
      dayjs,
    } = initParams;
    this._fakeDbUserFactory = await makeFakeDbUserFactory;
    this._controllerDataBuilder = makeControllerDataBuilder;
    this._createPackageTransactionCheckoutUsecase =
      await makeCreatePackageTransactionCheckoutUsecase;
    this._fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
    this._dayjs = dayjs;
    return this;
  };
}

export { FakePackageTransactionCheckoutTokenHandler };
