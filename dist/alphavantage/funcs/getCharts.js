"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAllChartSeriesCrypto = exports.setAllChartSeries = exports.setYearChartSeriesCrypto = exports.setYearChartSeries = exports.set5MonthsChartSeriesCrypto = exports.set5MonthsChartSeries = exports.setMonthChartSeriesCrypto = exports.setMonthChartSeries = exports.set15DaysChartSeriesCrypto = exports.set15DaysChartSeries = exports.setWeekChartSeriesCrypto = exports.setWeekChartSeries = exports.setDayChartSeriesCrypto = exports.setDayChartSeries = exports.set1HourChartSeriesCrypto = exports.set1HourChartSeries = exports.set5HoursChartSeriesCrypto = exports.set5HoursChartSeries = exports.getAssetData24h = void 0;
const aplha_api_1 = require("./aplha_api");
async function getAssetData24h(symbol) {
    try {
        const result = {};
        let chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_INTRADAY", { key: "symbol", value: symbol }, { key: "outputsize", value: "full" }, { key: "interval", value: "60min" });
        while (chartData.Note) {
            await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
            chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_INTRADAY", { key: "symbol", value: symbol }, { key: "outputsize", value: "full" }, { key: "interval", value: "60min" });
        }
        const chartSeries = chartData["Time Series (60min)"];
        const lastItem = Object.keys(chartSeries)[0];
        result.ExchangeRate = Number(chartSeries[lastItem]["4. close"]);
        let volume24h = 0;
        let sumExchangeRate = 0;
        let lengthExchangeRate = 0;
        let avExchangeRate48h = 0;
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 86400000) {
                volume24h += Number(chartSeries[item]["5. volume"]);
            }
            if (!avExchangeRate48h && new Date().getTime() - date.getTime() >= 172800000) {
                avExchangeRate48h = sumExchangeRate / lengthExchangeRate;
            }
            if (new Date().getTime() - date.getTime() < 2628000000) {
                sumExchangeRate += Number(chartSeries[item]["4. close"]);
                lengthExchangeRate++;
                continue;
            }
            break;
        }
        const avExchangeRate = sumExchangeRate / lengthExchangeRate;
        result.boomRatio = (avExchangeRate48h - avExchangeRate) / avExchangeRate * 100;
        result.Volume24h = volume24h;
        return result;
    }
    catch (err) {
        return null;
    }
}
exports.getAssetData24h = getAssetData24h;
async function set5HoursChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "5min" });
        const chartSeries = chartData["Time Series (5min)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 18000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.set5HoursChartSeries = set5HoursChartSeries;
async function set5HoursChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("CRYPTO_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "5min" }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series Crypto (5min)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 18000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.set5HoursChartSeriesCrypto = set5HoursChartSeriesCrypto;
async function set1HourChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "1min" });
        const chartSeries = chartData["Time Series (1min)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 3600000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.set1HourChartSeries = set1HourChartSeries;
async function set1HourChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("CRYPTO_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "1min" }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series Crypto (1min)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 3600000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.set1HourChartSeriesCrypto = set1HourChartSeriesCrypto;
async function setDayChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "5min" });
        const chartSeries = chartData["Time Series (5min)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 86400000) {
                console.log(chartSeries[item]);
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setDayChartSeries = setDayChartSeries;
async function setDayChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("CRYPTO_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "5min" }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series Crypto (5min)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 86400000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setDayChartSeriesCrypto = setDayChartSeriesCrypto;
async function setWeekChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "60min" });
        const chartSeries = chartData["Time Series (60min)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 604800000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setWeekChartSeries = setWeekChartSeries;
async function setWeekChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("CRYPTO_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "60min" }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series Crypto (60min)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 604800000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setWeekChartSeriesCrypto = setWeekChartSeriesCrypto;
async function set15DaysChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_DAILY", { key: "symbol", value: symbol });
        const chartSeries = chartData["Time Series (Daily)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 1296000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.set15DaysChartSeries = set15DaysChartSeries;
async function set15DaysChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("DIGITAL_CURRENCY_DAILY", { key: "symbol", value: symbol }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series (Digital Currency Daily)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 1296000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.set15DaysChartSeriesCrypto = set15DaysChartSeriesCrypto;
async function setMonthChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_DAILY", { key: "symbol", value: symbol });
        const chartSeries = chartData["Time Series (Daily)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 2628000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setMonthChartSeries = setMonthChartSeries;
async function setMonthChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("DIGITAL_CURRENCY_DAILY", { key: "symbol", value: symbol }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series (Digital Currency Daily)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 2628000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setMonthChartSeriesCrypto = setMonthChartSeriesCrypto;
async function set5MonthsChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_DAILY", { key: "symbol", value: symbol });
        const chartSeries = chartData["Time Series (Daily)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 13140000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.set5MonthsChartSeries = set5MonthsChartSeries;
async function set5MonthsChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("DIGITAL_CURRENCY_DAILY", { key: "symbol", value: symbol }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series (Digital Currency Daily)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 13140000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.set5MonthsChartSeriesCrypto = set5MonthsChartSeriesCrypto;
async function setYearChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_WEEKLY", { key: "symbol", value: symbol });
        const chartSeries = chartData["Weekly Time Series"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 31540000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setYearChartSeries = setYearChartSeries;
async function setYearChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("DIGITAL_CURRENCY_WEEKLY", { key: "symbol", value: symbol }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series (Digital Currency Weekly)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            if (new Date(lastItem).getTime() - date.getTime() < 31540000000) {
                filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
                continue;
            }
            break;
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setYearChartSeriesCrypto = setYearChartSeriesCrypto;
async function setAllChartSeries(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("TIME_SERIES_MONTHLY", { key: "symbol", value: symbol });
        const chartSeries = chartData["Monthly Time Series"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setAllChartSeries = setAllChartSeries;
async function setAllChartSeriesCrypto(filteredChartData, symbol, chartType) {
    try {
        const chartData = await (0, aplha_api_1.alpha_api)("DIGITAL_CURRENCY_MONTHLY", { key: "symbol", value: symbol }, { key: "market", value: "USD" });
        const chartSeries = chartData["Time Series (Digital Currency Monthly)"];
        const lastItem = Object.keys(chartSeries)[0];
        for (const item in chartSeries) {
            const date = new Date(item);
            filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
        }
    }
    catch (err) {
        filteredChartData = [];
    }
}
exports.setAllChartSeriesCrypto = setAllChartSeriesCrypto;
//# sourceMappingURL=getCharts.js.map