"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alpha_api = void 0;
const axios_1 = require("axios");
class paramDto {
}
async function alpha_api(func, ...params) {
    let link = `https://www.alphavantage.co/query?apikey=${process.env.ALPHA_API_KEY}&function=${func}`;
    params.forEach(param => {
        link += `&${param.key}=${param.value}`;
    });
    console.log(link);
    const response = await axios_1.default.get(link);
    if (func === "LISTING_STATUS" && Object.keys(response.data).length === 0) {
        return {
            "Note": "Limit"
        };
    }
    if (response.data.Note)
        console.log("LIMIT");
    return response.data;
}
exports.alpha_api = alpha_api;
//# sourceMappingURL=aplha_api.js.map