"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOutdatedSessions = void 0;
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
                maxAllowedDate: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$populatedUser.sessionTerminationTimeframe", "week"] }, then: { $subtract: [new Date(), 7 * 24 * 60 * 60 * 1000] } },
                            { case: { $eq: ["$populatedUser.sessionTerminationTimeframe", "month"] }, then: { $subtract: [new Date(), 30 * 24 * 60 * 60 * 1000] } },
                            { case: { $eq: ["$populatedUser.sessionTerminationTimeframe", "3months"] }, then: { $subtract: [new Date(), 3 * 30 * 24 * 60 * 60 * 1000] } },
                            { case: { $eq: ["$populatedUser.sessionTerminationTimeframe", "6months"] }, then: { $subtract: [new Date(), 6 * 30 * 24 * 60 * 60 * 1000] } }
                        ]
                    }
                }
            } },
        { $match: {
                $expr: { $lt: ["$lastActivity", "$maxAllowedDate"] }
            } }
    ]);
    const data = { sessionIds: [], userIds: [] };
    sessionsToDelete.forEach(session => {
        data.sessionIds.push(session._id);
        data.userIds.push(session.populatedUser._id);
    });
    for (let i = 0; i < data.userIds.length; i++) {
        const user = await userModel.findById(data.userIds[i]).select("sessions");
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