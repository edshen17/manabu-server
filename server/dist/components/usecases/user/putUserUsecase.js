"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutUserUsecase = void 0;
class PutUserUsecase {
    constructor() {
        this.init = async (services) => {
            const { makeUserDbService, makePackageTransactionDbService, makeMinuteBankDbService } = services;
            this.userDbService = await makeUserDbService;
            this.packageTransactionDbService = await makePackageTransactionDbService;
            this.minuteBankDbService = await makeMinuteBankDbService;
            return this;
        };
        this._isValidBody = (body) => {
            const { role, _id, dateRegistered } = body;
            return !role && !_id && !dateRegistered;
        };
        this._updateDbUserDependencyData = async (props) => {
            const { dbService, savedDbUser, accessOptions, hostedBySearchQuery, reservedBySearchQuery } = props;
            const updateHostedByData = await dbService.updateMany({
                searchQuery: hostedBySearchQuery,
                updateParams: { hostedByData: savedDbUser },
                accessOptions,
            });
            const updateReservedByData = await dbService.updateMany({
                searchQuery: reservedBySearchQuery,
                updateParams: { reservedByData: savedDbUser },
                accessOptions,
            });
        };
        this._makeRequestSetup = (controllerData) => {
            const { routeData, currentAPIUser } = controllerData;
            const { body, params } = routeData;
            const isCurrentAPIUserPermitted = params.uId == currentAPIUser.userId || currentAPIUser.role == 'admin';
            const accessOptions = {
                isProtectedResource: true,
                isCurrentAPIUserPermitted,
                currentAPIUserRole: currentAPIUser.role,
                isSelf: params.uId == currentAPIUser.userId,
            };
            const isValidUpdate = currentAPIUser.role == 'admin' || this._isValidBody(body);
            return { accessOptions, body, isValidUpdate, params };
        };
        this.makeRequest = async (controllerData) => {
            const { isValidUpdate, params, body, accessOptions } = this._makeRequestSetup(controllerData);
            if (isValidUpdate) {
                const savedDbUser = await this.userDbService.update({
                    searchQuery: { _id: params.uId },
                    updateParams: body,
                    accessOptions,
                });
                //TODO remove await...
                // update minute banks
                await this._updateDbUserDependencyData({
                    dbService: this.minuteBankDbService,
                    savedDbUser,
                    accessOptions,
                    hostedBySearchQuery: { hostedBy: savedDbUser._id },
                    reservedBySearchQuery: { reservedBy: savedDbUser._id },
                });
                // update package transactions
                await this._updateDbUserDependencyData({
                    dbService: this.packageTransactionDbService,
                    savedDbUser,
                    accessOptions,
                    hostedBySearchQuery: { hostedBy: savedDbUser._id, isPast: false },
                    reservedBySearchQuery: { reservedBy: savedDbUser._id, isPast: false },
                });
                // this._updateAppointments(params.uid);
                // this._updateAvailableTimes(params.uid);
                return savedDbUser;
            }
            else {
                throw new Error('You do not have the permissions to update those properties.');
            }
        };
    }
}
exports.PutUserUsecase = PutUserUsecase;
