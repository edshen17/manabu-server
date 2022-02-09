import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { CreatePackageTransactionCheckoutUsecase } from '../../checkout/packageTransaction/createPackageTransactionCheckoutUsecase/createPackageTransactionCheckoutUsecase';
import { ControllerDataBuilder } from '../controllerDataBuilder/controllerDataBuilder';
declare class FakePackageTransactionCheckoutTokenHandler {
    private _fakeDbUserFactory;
    private _fakeDbAvailableTimeFactory;
    private _controllerDataBuilder;
    private _createPackageTransactionCheckoutUsecase;
    private _dayjs;
    createTokenData: () => Promise<{
        token: string;
        currentAPIUser: CurrentAPIUser;
    }>;
    private _createCurrentAPIUser;
    private _createRouteData;
    private _createControllerData;
    init: (initParams: {
        makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
        makeControllerDataBuilder: ControllerDataBuilder;
        makeCreatePackageTransactionCheckoutUsecase: Promise<CreatePackageTransactionCheckoutUsecase>;
        makeFakeDbAvailableTimeFactory: Promise<FakeDbAvailableTimeFactory>;
        dayjs: any;
    }) => Promise<this>;
}
export { FakePackageTransactionCheckoutTokenHandler };
