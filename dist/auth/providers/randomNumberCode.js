"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomNumberCode = void 0;
const crypto_1 = require("crypto");
function randomNumberCode(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += String((0, crypto_1.randomInt)(0, 10));
    }
    return result;
}
exports.randomNumberCode = randomNumberCode;
//# sourceMappingURL=randomNumberCode.js.map