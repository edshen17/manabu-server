"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditUserUsecase = void 0;
const AbstractEditUsecase_1 = require("../../abstractions/AbstractEditUsecase");
class EditUserUsecase extends AbstractEditUsecase_1.AbstractEditUsecase {
    _nGramHandler;
    _sanitizeHtml;
    _makeRequestTemplate = async (props) => {
        const { params, body, dbServiceAccessOptions } = props;
        const { name, profileBio } = body;
        if (name) {
            body.nameNGrams = this._nGramHandler.createEdgeNGrams({ str: name, isPrefixOnly: false });
            body.namePrefixNGrams = this._nGramHandler.createEdgeNGrams({
                str: name,
                isPrefixOnly: true,
            });
        }
        if (profileBio) {
            body.profileBio = this._sanitizeHtml(profileBio);
        }
        const user = await this._dbService.findOneAndUpdate({
            searchQuery: { _id: params.userId },
            updateQuery: body,
            dbServiceAccessOptions,
        });
        return { user };
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeEditEntityValidator, makeNGramHandler, sanitizeHtml } = optionalInitParams;
        this._editEntityValidator = makeEditEntityValidator;
        this._nGramHandler = makeNGramHandler;
        this._sanitizeHtml = sanitizeHtml;
    };
}
exports.EditUserUsecase = EditUserUsecase;
