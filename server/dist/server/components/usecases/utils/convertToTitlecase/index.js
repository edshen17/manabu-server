"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToTitlecase = void 0;
const convertToTitlecase = (str) => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
exports.convertToTitlecase = convertToTitlecase;
