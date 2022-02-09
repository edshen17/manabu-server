"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakePackageTransactionCheckoutTokenHandler = void 0;
class FakePackageTransactionCheckoutTokenHandler {
    _fakeDbUserFactory;
    _fakeDbAvailableTimeFactory;
    _controllerDataBuilder;
    _createPackageTransactionCheckoutUsecase;
    _dayjs;
    createTokenData = async () => {
        const routeData = await this._createRouteData();
        const currentAPIUser = await this._createCurrentAPIUser();
        const controllerData = this._createControllerData({ routeData, currentAPIUser });
        const createPackageTransactionCheckoutRes = await this._createPackageTransactionCheckoutUsecase.makeRequest(controllerData);
        const { token } = createPackageTransactionCheckoutRes;
        const tokenData = { token, currentAPIUser };
        return tokenData;
    };
    _createCurrentAPIUser = async () => {
        const fakeUser = await this._fakeDbUserFactory.createFakeDbUser();
        const currentAPIUser = {
            userId: fakeUser._id,
            role: fakeUser.role,
        };
        return currentAPIUser;
    };
    _createRouteData = async () => {
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
                teacherId: fakeTeacher.teacherData._id,
                packageId: fakeTeacher.teacherData.packages[0]._id,
                lessonDuration: 60,
                lessonLanguage: 'ja',
                timeslots: [{ startDate, endDate }],
            },
            query: {
                paymentGateway: 'paynow',
            },
            endpointPath: '',
        };
        return createPackageTransactionCheckoutRouteData;
    };
    _createControllerData = (props) => {
        const { routeData, currentAPIUser } = props;
        const createPackageTransactionCheckoutControllerData = this._controllerDataBuilder
            .routeData(routeData)
            .currentAPIUser(currentAPIUser)
            .build();
        return createPackageTransactionCheckoutControllerData;
    };
    init = async (initParams) => {
        const { makeFakeDbUserFactory, makeControllerDataBuilder, makeCreatePackageTransactionCheckoutUsecase, makeFakeDbAvailableTimeFactory, dayjs, } = initParams;
        this._fakeDbUserFactory = await makeFakeDbUserFactory;
        this._controllerDataBuilder = makeControllerDataBuilder;
        this._createPackageTransactionCheckoutUsecase =
            await makeCreatePackageTransactionCheckoutUsecase;
        this._fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
        this._dayjs = dayjs;
        return this;
    };
}
exports.FakePackageTransactionCheckoutTokenHandler = FakePackageTransactionCheckoutTokenHandler;
