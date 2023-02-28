"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareData = exports.hashData = void 0;
const bcrypt = require("bcrypt");
function hashData(data) {
    return bcrypt.hash(data, 10);
}
exports.hashData = hashData;
function compareData(data, hash) {
    return bcrypt.compare(data, hash);
}
exports.compareData = compareData;
//# sourceMappingURL=bcrypt.js.map