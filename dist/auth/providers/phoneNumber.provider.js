"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePhone = exports.isCorrectPhone = void 0;
const libphonenumber = require("libphonenumber-js");
function isCorrectPhone(phoneNumber) {
    return libphonenumber.isValidPhoneNumber(phoneNumber);
}
exports.isCorrectPhone = isCorrectPhone;
function parsePhone(phoneNumber) {
    return libphonenumber.parsePhoneNumber(phoneNumber);
}
exports.parsePhone = parsePhone;
//# sourceMappingURL=phoneNumber.provider.js.map