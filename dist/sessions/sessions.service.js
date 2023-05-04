"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("./session.schema");
const user_schema_1 = require("../user/user.schema");
const deleteOutdatedSessions_1 = require("./funcs/deleteOutdatedSessions");
let SessionsService = class SessionsService {
    constructor(sessionModel, userModel) {
        this.sessionModel = sessionModel;
        this.userModel = userModel;
        const now = new Date();
        const nextDay = new Date();
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0);
        nextDay.setMinutes(0);
        nextDay.setSeconds(0);
        (0, deleteOutdatedSessions_1.deleteOutdatedSessions)(sessionModel, userModel);
        setTimeout(() => {
            (0, deleteOutdatedSessions_1.deleteOutdatedSessions)(sessionModel, userModel);
            setInterval(() => {
                console.log("--cleared outdated sessions");
                (0, deleteOutdatedSessions_1.deleteOutdatedSessions)(sessionModel, userModel);
            }, 86400000);
        }, nextDay.getTime() - now.getTime());
    }
    async getSessions(userId) {
        const sessions = await this.sessionModel.find({ user: userId });
        return sessions;
    }
    async closeSession(sessionId, userId) {
        const session = await this.sessionModel.findById(sessionId);
        const user = await this.userModel.findById(session.user);
        if (userId !== user._id.toString())
            throw new common_1.HttpException("Access denied", common_1.HttpStatus.FORBIDDEN);
        const sessionIndex = user.sessions.findIndex(sess => sess.toString() === sessionId);
        user.sessions.splice(sessionIndex, 1);
        await session.remove();
        await user.save();
        return { message: "Session removed" };
    }
    async closeAllSessions(currentSessionId, userId, pin) {
        const currentSession = await this.sessionModel.findById(currentSessionId);
        const user = await this.userModel.findById(currentSession.user).select("+pin");
        if (userId !== user._id.toString())
            throw new common_1.HttpException("Access denied", common_1.HttpStatus.FORBIDDEN);
        if (pin !== user.pin)
            throw new common_1.HttpException("Incorrect pin code", common_1.HttpStatus.FORBIDDEN);
        user.sessions.forEach(async (session) => {
            const foundSession = await this.sessionModel.findById(session);
            if (foundSession && foundSession._id.toString() !== currentSessionId) {
                await foundSession.remove();
            }
        });
        user.sessions = [currentSession];
        await user.save();
        return { message: "Sessions closed" };
    }
    async setSessionExpirationPeriod(userId, period) {
        try {
            const user = await this.userModel.findById(userId);
            user.sessionTerminationTimeframe = period;
            await user.save();
            return period;
        }
        catch (err) {
            throw new common_1.HttpException('Error saving to DB', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SessionsService);
exports.SessionsService = SessionsService;
//# sourceMappingURL=sessions.service.js.map