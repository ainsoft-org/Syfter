"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendationsML = void 0;
const getNeighs_1 = require("./getNeighs");
const common_1 = require("@nestjs/common");
const getRecommendations_1 = require("./getRecommendations");
const getRecommendationsML = (data, userId, forIgnore = []) => {
    const neigs = (0, getNeighs_1.getNeighs)(data, userId);
    if (neigs === "user not found")
        throw new common_1.HttpException('userId is not correct', common_1.HttpStatus.NOT_FOUND);
    const minRating = Number(process.env.ML_minRating);
    return (0, getRecommendations_1.getRecommendations)(neigs.kNN, neigs.forUser, minRating, forIgnore);
};
exports.getRecommendationsML = getRecommendationsML;
//# sourceMappingURL=index.js.map