"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailTokenUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class VerifyEmailTokenUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _redirectUrlBuilder;
    _isSelf = async (props) => {
        return true;
    };
    _makeRequestTemplate = async (props) => {
        const { dbServiceAccessOptions, params } = props;
        const { verificationToken } = params;
        const user = await this._dbService.findOne({
            searchQuery: { verificationToken },
            dbServiceAccessOptions,
        });
        if (user) {
            const updatedUser = await this._dbService.findOneAndUpdate({
                searchQuery: { _id: user._id },
                updateQuery: { isEmailVerified: true },
                dbServiceAccessOptions,
            });
            const redirectUrl = this._redirectUrlBuilder.host('client').endpoint('/dashboard').build();
            return {
                redirectUrl,
                user: updatedUser,
            };
        }
        else {
            throw new Error('User not found.');
        }
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeRedirectUrlBuilder } = optionalInitParams;
        this._redirectUrlBuilder = makeRedirectUrlBuilder;
    };
}
exports.VerifyEmailTokenUsecase = VerifyEmailTokenUsecase;
