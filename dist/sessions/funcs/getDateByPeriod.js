"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateByPeriod = void 0;
function getDateByPeriod(maxAllowedDate) {
    const date = new Date();
    switch (maxAllowedDate) {
        case "week":
            date.setDate(date.getDate() - 7);
            return date;
        case "month":
            date.setMonth(date.getMonth() - 1);
            return date;
        case "3months":
            date.setMonth(date.getMonth() - 3);
            return date;
        case "6months":
            date.setMonth(date.getMonth() - 6);
            return date;
    }
    return null;
}
exports.getDateByPeriod = getDateByPeriod;
//# sourceMappingURL=getDateByPeriod.js.map