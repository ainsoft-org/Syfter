"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOutdatedSessions = void 0;
const getDateByPeriod_1 = require("./getDateByPeriod");
const deleteOutdatedSessions = async (sessionModel, userModel) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const sessionsToDelete = await sessionModel.aggregate([
        { $match: {
                lastActivity: { $lt: weekAgo }
            } },
        { $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "populatedUser"
            } },
        { $addFields: {
                populatedUser: { $arrayElemAt: ["$populatedUser", 0] }
            } },
        { $addFields: {
                maxAllowedDate: "$populatedUser.sessionTerminationTimeframe"
            } },
        { $addFields: {
                maxAllowedDate: { $function: {
                        body: getDateByPeriod_1.getDateByPeriod,
                        args: ["$maxAllowedDate"],
                        lang: "js"
                    } }
            } },
        { $addFields: {
                shouldToDelete: { $function: {
                        body: function (maxAllowedDate, lastActivity) {
                            return new Date(lastActivity).getTime() < new Date(maxAllowedDate).getTime();
                        },
                        args: ["$maxAllowedDate", "$lastActivity"],
                        lang: "js"
                    } }
            } },
        { $match: {
                shouldToDelete: true
            } }
    ]);
    const data = { sessionIds: [], userIds: [] };
    sessionsToDelete.forEach(session => {
        data.sessionIds.push(session._id);
        data.userIds.push(session.populatedUser._id);
    });
    for (let i = 0; i < data.userIds.length; i++) {
        const user = await userModel.findById(data.userIds[i]);
        if (!user)
            continue;
        const sessionIndex = user.sessions.findIndex(session => session.toString() === data.sessionIds[i].toString());
        if (sessionIndex === -1)
            continue;
        user.sessions.splice(sessionIndex, 1);
        await user.save();
    }
    await sessionModel.deleteMany({ _id: { $in: data.sessionIds } });
};
exports.deleteOutdatedSessions = deleteOutdatedSessions;
//# sourceMappingURL=deleteOutdatedSessions.js.map