"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearEmailConfirmations = void 0;
async function clearEmailConfirmations(emailConfirmation) {
    const emailConfirmationLifeTime = Number(process.env.emailConfirmationLifetime);
    const now = new Date();
    const emailConfirmations = await emailConfirmation.find();
    emailConfirmations.forEach(confirmation => {
        const prevCodeDate = new Date(confirmation.createdAt);
        if (now.getTime() - prevCodeDate.getTime() >= emailConfirmationLifeTime) {
            confirmation.remove();
        }
    });
    return true;
}
exports.clearEmailConfirmations = clearEmailConfirmations;
//# sourceMappingURL=clearEmailConfirmations.js.map