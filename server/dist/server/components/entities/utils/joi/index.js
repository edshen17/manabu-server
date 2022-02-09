"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joi = void 0;
const Joi = require('joi-oid');
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const joi = Joi.extend((joi) => {
    return {
        type: 'string',
        base: joi.string(),
        rules: {
            htmlStrip: {
                validate(value) {
                    return (0, sanitize_html_1.default)(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                    });
                },
            },
        },
    };
});
exports.joi = joi;
