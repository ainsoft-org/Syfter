"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRegisteringUsers = void 0;
const dotenv = require("dotenv");
dotenv.config();
async function clearRegisteringUsers(regingUserModel) {
    const userUnconfirmedLifeTime = Number(process.env.registringUserLifetime);
    const now = new Date();
    const users = await regingUserModel.find();
    users.forEach(user => {
        const prevCodeDate = new Date(user.prevCodeTime);
        if (now.getTime() - prevCodeDate.getTime() >= userUnconfirmedLifeTime) {
            user.remove();
        }
    });
    return true;
}
exports.clearRegisteringUsers = clearRegisteringUsers;
//# sourceMappingURL=clearRegisteringUsers.provider.js.map