"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const initializeUser = async (props) => {
    const authToken = await props.postUserUsecase.makeRequest(props.controllerData);
    const secret = process.env.JWT_SECRET;
    const decoded = jsonwebtoken_1.default.verify(authToken.token, secret);
    const currentAPIUser = {
        userId: decoded._id,
        role: props.viewingAs,
        isVerified: true,
    };
    const routeData = { params: { uId: decoded._id }, body: {} };
    if (!props.isSelf) {
        currentAPIUser.userId = undefined;
    }
    const newUser = await props.getUserUsecase.makeRequest({
        currentAPIUser,
        routeData,
        endpointPath: props.endpointPath,
    });
    return newUser;
};
exports.initializeUser = initializeUser;
