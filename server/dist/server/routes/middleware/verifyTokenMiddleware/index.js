"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const convertStringToObjectId_1 = require("../../../components/entities/utils/convertStringToObjectId");
const jwtHandler_1 = require("../../../components/usecases/utils/jwtHandler");
let jwtHandler;
(async () => {
    jwtHandler = await jwtHandler_1.makeJwtHandler;
})();
const verifyToken = async (req, res, next) => {
    try {
        if (req.headers['x-requested-with'] && req.cookies.hp && req.cookies.sig) {
            const token = req.cookies.hp + req.cookies.sig;
            const decodedUser = await jwtHandler.verify(token);
            if (!decodedUser) {
                throw new Error('Invalid jwt format.');
            }
            const { _id, role, teacherData } = decodedUser;
            req.userId = (0, convertStringToObjectId_1.convertStringToObjectId)(_id);
            req.role = role || 'user';
            req.token = token;
            if (teacherData) {
                req.teacherId = (0, convertStringToObjectId_1.convertStringToObjectId)(teacherData._id);
            }
        }
        next();
    }
    catch (err) {
        next();
    }
};
exports.verifyToken = verifyToken;
