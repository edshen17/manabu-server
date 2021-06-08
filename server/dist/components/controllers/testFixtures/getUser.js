"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const user_1 = require("../user");
const getUser = async (savedDbUser, viewingUser) => {
    const isSelf = savedDbUser._id == viewingUser._id;
    const getUserController = await user_1.makeGetUserController;
    const paramId = isSelf ? viewingUser._id : savedDbUser._id;
    const path = isSelf ? '/me' : `/user/${savedDbUser._id}`;
    const httpRequest = {
        body: {},
        path,
        query: {},
        params: {
            uId: paramId,
        },
        currentAPIUser: {
            userId: viewingUser._id,
            role: 'user',
            isVerified: false,
        },
    };
    return await getUserController.makeRequest(httpRequest);
};
exports.getUser = getUser;
