"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCryptoCurrencies = exports.getNews = exports.getCurrencies = void 0;
const csv = require("csvtojson");
const aplha_api_1 = require("./aplha_api");
const axios_1 = require("axios");
const convertDate_1 = require("../../common/convertDate");
class currencyDto {
}
const speed = Number(process.env.ASSETS_REFRESH_SPEED);
async function getCurrencies() {
    let response = await (0, aplha_api_1.alpha_api)("LISTING_STATUS");
    while (response.Note) {
        await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
        response = await (0, aplha_api_1.alpha_api)("LISTING_STATUS");
    }
    try {
        const currenciesJSON = await csv().fromString(response);
        return currenciesJSON;
    }
    catch (err) {
        return null;
    }
}
exports.getCurrencies = getCurrencies;
async function getNews(assets, limit, from, to) {
    let response = await (0, aplha_api_1.alpha_api)("NEWS_SENTIMENT", { key: "tickers", value: assets }, { key: "limit", value: limit ? limit.toString() : "" }, { key: "time_from", value: from ? (0, convertDate_1.toISO)(from) : "" }, { key: "time_to", value: to ? (0, convertDate_1.toISO)(to) : "" });
    while (response.Note) {
        await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
        response = await (0, aplha_api_1.alpha_api)("NEWS_SENTIMENT", { key: "tickers", value: assets }, { key: "limit", value: limit ? limit.toString() : "" }, { key: "time_from", value: from ? (0, convertDate_1.toISO)(from) : "" }, { key: "time_to", value: to ? (0, convertDate_1.toISO)(to) : "" });
    }
    return response;
}
exports.getNews = getNews;
async function getCryptoCurrencies() {
    let response = await axios_1.default.get('https://www.alphavantage.co/digital_currency_list/');
    while (response.data.Note) {
        await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
        response = await axios_1.default.get('https://www.alphavantage.co/digital_currency_list/');
    }
    try {
        const currenciesJSON = await csv().fromString(response.data);
        return currenciesJSON;
    }
    catch (err) {
        return null;
    }
}
exports.getCryptoCurrencies = getCryptoCurrencies;
//# sourceMappingURL=getActiveCurrencies.js.map