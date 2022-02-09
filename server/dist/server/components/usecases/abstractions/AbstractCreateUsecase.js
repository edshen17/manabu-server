"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractCreateUsecase = void 0;
const AbstractUsecase_1 = require("./AbstractUsecase");
class AbstractCreateUsecase extends AbstractUsecase_1.AbstractUsecase {
    _isSelf = async (props) => {
        const { currentAPIUser } = props;
        const isSelf = currentAPIUser.userId ? true : false;
        return isSelf;
    };
}
exports.AbstractCreateUsecase = AbstractCreateUsecase;
