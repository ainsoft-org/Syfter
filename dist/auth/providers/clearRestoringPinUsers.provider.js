"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearRestoringPinUsers = void 0;
const dotenv = require("dotenv");
dotenv.config();
async function clearRestoringPinUsers(restoringPinUserModel) {
    const userUnconfirmedLifeTime = Number(process.env.registringUserLifetime);
    const now = new Date();
    const users = await restoringPinUserModel.find();
    users.forEach(user => {
        const prevCodeDate = new Date(user.createdAt);
        if (now.getTime() - prevCodeDate.getTime() >= userUnconfirmedLifeTime) {
            user.remove();
        }
    });
    return true;
}
exports.clearRestoringPinUsers = clearRestoringPinUsers;
//# sourceMappingURL=clearRestoringPinUsers.provider.js.map