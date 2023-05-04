"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthingUsers = void 0;
const dotenv = require("dotenv");
dotenv.config();
async function clearAuthingUsers(authingUserModel) {
    const userUnconfirmedLifeTime = Number(process.env.registringUserLifetime);
    const now = new Date();
    const users = await authingUserModel.find();
    users.forEach(user => {
        const prevCodeDate = new Date(user.createdAt);
        if (now.getTime() - prevCodeDate.getTime() >= userUnconfirmedLifeTime) {
            user.remove();
        }
    });
    return true;
}
exports.clearAuthingUsers = clearAuthingUsers;
//# sourceMappingURL=clearAuthingUsers.provider.js.map