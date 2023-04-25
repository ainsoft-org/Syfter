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
exports.AlphavantageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const currency_schema_1 = require("./currency.schema");
const refreshCurrencies_1 = require("./funcs/refreshCurrencies");
const news_schema_1 = require("../news/news.schema");
const currentStat_schema_1 = require("./currentStat.schema");
const user_schema_1 = require("../user/user.schema");
const shuffleArray_1 = require("../common/shuffleArray");
const aplha_api_1 = require("./funcs/aplha_api");
const getCharts_1 = require("./funcs/getCharts");
const getDateFromYearsAgo_1 = require("./funcs/getDateFromYearsAgo");
const machine_learning_1 = require("./machine_learning");
const fs = require("fs");
const path = require("path");
let AlphavantageService = class AlphavantageService {
    constructor(userModel, currencyModel, newsModel, currentStatModel, cacheManager) {
        this.userModel = userModel;
        this.currencyModel = currencyModel;
        this.newsModel = newsModel;
        this.currentStatModel = currentStatModel;
        this.cacheManager = cacheManager;
        this.cryptoLogos = null;
        const now = new Date();
        const nextDay = new Date();
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(0);
        nextDay.setMinutes(0);
        nextDay.setSeconds(0);
        if (process.env.isDev !== "true") {
            (0, refreshCurrencies_1.refreshCurrencies)(currencyModel, newsModel, currentStatModel);
            setTimeout(() => {
                (0, refreshCurrencies_1.refreshCurrencies)(currencyModel, newsModel, currentStatModel);
                setInterval(() => {
                    (0, refreshCurrencies_1.refreshCurrencies)(currencyModel, newsModel, currentStatModel);
                }, Number(process.env.refreshAssetsEvery));
            }, nextDay.getTime() - now.getTime());
            (0, refreshCurrencies_1.refreshCryptoCurrencies)(currencyModel, newsModel);
            setTimeout(() => {
                (0, refreshCurrencies_1.refreshCryptoCurrencies)(currencyModel, newsModel);
                setInterval(() => {
                    (0, refreshCurrencies_1.refreshCryptoCurrencies)(currencyModel, newsModel);
                }, Number(process.env.refreshCryptosEvery));
            }, nextDay.getTime() - now.getTime());
        }
        const cryptoLogosText = fs.readFileSync(path.join(__dirname, '../common/cryptoLogos.json')).toString();
        this.cryptoLogos = JSON.parse(cryptoLogosText);
    }
    async getRecommendation(userId, filters, amount = 1, forIgnore = [], type = "") {
        if (amount <= 0) {
            throw new common_1.HttpException("field amount must be positive", common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userModel.findById(userId);
        if (user.reactions.length <= 8) {
            return await this.getCalibrationAssets(amount, filters, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())]);
        }
        const randomNumber = Math.random();
        if ((randomNumber >= 0 && randomNumber < 0.075 && type === "") || type === "TOP_CAPITALIZATION") {
            return await this.getCalibrationAssets(amount, filters, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())]);
        }
        else if ((randomNumber >= 0.075 && randomNumber < 0.15 && type === "") || type === "NEW_COMPANIES") {
            return await this.getNewCompaniesFavouriteSubcategories(amount, filters, user.likedSectors, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())]);
        }
        else if ((randomNumber >= 0.15 && randomNumber < 0.25 && type === "") || type === "RERECOMMENDATION") {
            return await this.getReRecommendation(user, amount, forIgnore, filters);
        }
        else if ((randomNumber >= 0.25 && randomNumber < 0.5 && type === "") || type === "PRICE_INCREASE") {
            return this.getRecByPriceIncrease(amount, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())], filters);
        }
        else if ((randomNumber >= 0.5 && randomNumber < 0.75 && type === "") || type === "NEWS_INCREASE") {
            return this.getRecByNewsIncrease(amount, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())], filters);
        }
        else if ((randomNumber >= 0.75 && randomNumber <= 1 && type === "") || type === "MACHINE_LEARNING") {
            return await this.getAssetsBySimilarUsers(userId, forIgnore, user, amount, filters);
        }
        return null;
    }
    async getWatchlist(userId, amount, forIgnore = [], filters = {}) {
        const user = await this.userModel.findById(userId).select("reactions");
        const likedReactions = user.reactions.filter((reaction) => reaction.isLiked === true && reaction.asset !== null);
        const assets = await this.currencyModel.aggregate([
            { $match: {
                    _id: {
                        $in: likedReactions.map(reaction => reaction.asset),
                        $nin: forIgnore.map(asset => new mongoose_2.default.Types.ObjectId(asset)),
                    },
                    ...this.getAggregationFilter(filters)
                } },
            { $addFields: {
                    position: {
                        $indexOfArray: [
                            likedReactions.map(reaction => reaction.asset),
                            "$_id"
                        ]
                    }
                } },
            { $sort: {
                    position: 1
                } },
            { $limit: amount },
            { $unset: ["news", "reactions"] }
        ]);
        return { assets: await this.getAssetData(assets), amount: assets.length };
    }
    async getFavourites(userId, amount, forIgnore = [], filters = {}) {
        const user = await this.userModel.findById(userId).select("favourites");
        const assets = await this.currencyModel.aggregate([
            { $match: {
                    _id: {
                        $in: user.favourites,
                        $nin: forIgnore.map(asset => new mongoose_2.default.Types.ObjectId(asset)),
                    },
                    ...this.getAggregationFilter(filters)
                } },
            { $addFields: {
                    favourites: user.favourites
                } },
            { $addFields: {
                    position: {
                        $indexOfArray: [
                            user.favourites,
                            "$_id"
                        ]
                    }
                } },
            { $sort: {
                    position: 1
                } },
            { $limit: amount },
            { $unset: ["news", "favourites"] }
        ]);
        return { assets: await this.getAssetData(assets), amount: assets.length };
    }
    async addAssetToFavourites(userId, assetId) {
        const user = await this.userModel.findById(userId);
        const asset = await this.currencyModel.findById(assetId);
        if (!asset)
            throw new common_1.HttpException("Asset not found", common_1.HttpStatus.NOT_FOUND);
        const favouriteIndex = user.favourites.findIndex(favourite => favourite.toString() === assetId);
        if (favouriteIndex !== -1) {
            throw new common_1.HttpException("Asset already in favourites", common_1.HttpStatus.BAD_REQUEST);
        }
        user.favourites.push(asset);
        await user.save();
        return user.favourites;
    }
    async removeFavourite(userId, assetId) {
        const user = await this.userModel.findById(userId);
        const asset = await this.currencyModel.findById(assetId);
        if (!asset)
            throw new common_1.HttpException("Asset not found", common_1.HttpStatus.NOT_FOUND);
        const favouriteIndex = user.favourites.findIndex(favourite => favourite.toString() === assetId);
        if (favouriteIndex === -1) {
            throw new common_1.HttpException("Asset is not in favourites", common_1.HttpStatus.BAD_REQUEST);
        }
        user.favourites.splice(favouriteIndex, 1);
        await user.save();
        return user.favourites;
    }
    async setAssetPriority(assetId, priority) {
        const asset = await this.currencyModel.findById(assetId);
        if (!asset)
            throw new common_1.HttpException("Asset not found", common_1.HttpStatus.NOT_FOUND);
        asset.priority = priority;
        await asset.save();
        return asset;
    }
    async getTrendingNow(userId, amount, forIgnore = [], filters = {}) {
        const user = await this.userModel.findById(userId).select("favourites");
        const assets = await this.currencyModel.aggregate([
            { $match: {
                    _id: {
                        $nin: forIgnore.map(asset => new mongoose_2.default.Types.ObjectId(asset))
                    },
                    ...this.getAggregationFilter(filters)
                } },
            { $sort: {
                    priority: -1,
                    likes: -1
                } },
            { $limit: amount },
            { $unset: ["news"] }
        ]);
        const fullAssets = await this.getAssetData(assets);
        return { assets: fullAssets.map(asset => {
                const isLiked = user.favourites.some(favourite => favourite.toString() === asset._id.toString());
                return { ...asset, isLiked };
            }), amount: assets.length };
    }
    async getRecByPriceIncrease(amount, forIgnore, filters) {
        const assets = await this.currencyModel.aggregate([
            { $match: {
                    _id: {
                        $nin: forIgnore.map(asset => new mongoose_2.default.Types.ObjectId(asset))
                    },
                    ...this.getAggregationFilter(filters)
                } },
            { $unset: ["news"] },
            { $sort: {
                    boomRatio: -1
                } },
            { $limit: amount }
        ]);
        return { assets: await this.getAssetData(assets), type: "PRICE_INCREASE", amount: assets.length };
    }
    async getRecByNewsIncrease(amount, forIgnore, filters) {
        const assets = await this.currencyModel.aggregate([
            { $match: {
                    _id: {
                        $nin: forIgnore.map(asset => new mongoose_2.default.Types.ObjectId(asset))
                    },
                    ...this.getAggregationFilter(filters)
                } },
            { $unset: ["news"] },
            { $sort: {
                    newsBoomRatio: -1
                } },
            { $limit: amount }
        ]);
        return { assets: await this.getAssetData(assets), type: "NEWS_INCREASE", amount: assets.length };
    }
    async getReRecommendation(user, amount, forIgnore, filters) {
        const negativeReactions = [];
        for (let i = 0; i < user.reactions.length; i++) {
            const reactionDate = new Date(user.reactions[i].createdAt);
            const reRecommendMinPeriod = 0;
            if (!user.reactions[i].isLiked && new Date().getTime() - reactionDate.getTime() >= reRecommendMinPeriod) {
                negativeReactions.push(user.reactions[i].asset.toString());
            }
        }
        const assets = await this.getAssetsByIds((0, shuffleArray_1.shuffle)(negativeReactions), forIgnore, amount, filters);
        return { assets: assets, type: "RERECOMMENDATION", amount: assets.length };
    }
    async getAssetsByIds(assetIds, forIgnore, amount, filters) {
        const assets = await this.currencyModel.aggregate([
            { $match: {
                    _id: {
                        $in: assetIds.map(assetId => new mongoose_2.default.Types.ObjectId(assetId)),
                        $nin: forIgnore.map(asset => new mongoose_2.default.Types.ObjectId(asset))
                    },
                    ...this.getAggregationFilter(filters)
                } },
            { $unset: ["news"] },
            { $limit: amount }
        ]);
        return await this.getAssetData(assets);
    }
    async getAssetsBySimilarUsers(userId, forIgnore, user, amount, filters) {
        const allUsers = await this.userModel.find();
        const assetIds = (0, machine_learning_1.getRecommendationsML)(allUsers, userId, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())]);
        const assets = await this.currencyModel.aggregate([
            { $match: {
                    _id: {
                        $in: assetIds.map(assetId => new mongoose_2.default.Types.ObjectId(assetId.name))
                    },
                    ...this.getAggregationFilter(filters)
                } },
            { $unset: ["news"] },
            { $limit: amount }
        ]);
        return { assets: await this.getAssetData(assets), type: "MACHINE_LEARNING", amount: assets.length };
    }
    async getNewCompaniesFavouriteSubcategories(amount, filters, likedSectors, forIgnore = []) {
        let forIgnoreObjectIds = [];
        try {
            forIgnoreObjectIds = forIgnore.map(ignoreItem => new mongoose_2.default.Types.ObjectId(ignoreItem));
        }
        catch (err) {
            throw new common_1.HttpException("Invalid currencies ids for ignore", common_1.HttpStatus.BAD_REQUEST);
        }
        const assets = await this.currencyModel.aggregate([
            { $match: {
                    _id: {
                        $nin: forIgnoreObjectIds
                    },
                    ...this.getAggregationFilter(filters)
                } },
            { $unset: ["news"] },
            { $addFields: {
                    favouriteSectorCoeff: {
                        $let: {
                            vars: {
                                likedSectors: {
                                    $filter: {
                                        input: likedSectors,
                                        as: "likedSector",
                                        cond: { $eq: ["$$likedSector.Sector", "$Sector"] }
                                    }
                                }
                            },
                            in: {
                                $cond: [
                                    { $gt: [{ $size: "$$likedSectors" }, 0] },
                                    { $arrayElemAt: ["$$likedSectors.likes", 0] },
                                    0
                                ]
                            }
                        }
                    }
                } },
            { $sort: {
                    favouriteSectorCoeff: -1,
                    IpoDate: -1
                } },
            { $limit: amount }
        ]);
        return { assets: await this.getAssetData(assets), type: "NEW_COMPANIES", amount: assets.length };
    }
    async getAssetsById(assets) {
        const result = [];
        try {
            for (const asset of assets) {
                const foundAsset = await this.currencyModel.findById(asset);
                if (foundAsset) {
                    result.push(foundAsset);
                }
            }
            return result;
        }
        catch (err) {
            throw new common_1.HttpException("Invalid id one of assets", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAssetData(assets, interval = "24H", chartType = "regular") {
        for (let i = 0; i < assets.length; i++) {
            try {
                assets[i] = assets[i].toObject();
            }
            catch (err) { }
            const asset = assets[i];
            const symbol = asset.Symbol;
            const cashed_asset = await this.cacheManager.get(`getAssetData-${symbol}-${interval}`);
            if (cashed_asset) {
                assets[i] = cashed_asset;
                continue;
            }
            let data;
            const filteredChartData = {};
            if (asset.AssetType !== "Cryptocurrency") {
                data = await (0, aplha_api_1.alpha_api)("TIME_SERIES_INTRADAY", { key: "symbol", value: symbol }, { key: "interval", value: "30min" });
                switch (interval) {
                    case "1H":
                        await (0, getCharts_1.set1HourChartSeries)(filteredChartData, symbol, chartType);
                        break;
                    case "5H":
                        await (0, getCharts_1.set5HoursChartSeries)(filteredChartData, symbol, chartType);
                        break;
                    case "24H":
                        await (0, getCharts_1.setDayChartSeries)(filteredChartData, symbol, chartType);
                        break;
                    case "1W":
                        await (0, getCharts_1.setWeekChartSeries)(filteredChartData, symbol, chartType);
                        break;
                    case "15D":
                        await (0, getCharts_1.set15DaysChartSeries)(filteredChartData, symbol, chartType);
                        break;
                    case "1M":
                        await (0, getCharts_1.setMonthChartSeries)(filteredChartData, symbol, chartType);
                        break;
                    case "5M":
                        await (0, getCharts_1.set5MonthsChartSeries)(filteredChartData, symbol, chartType);
                        break;
                    case "1Y":
                        await (0, getCharts_1.setYearChartSeries)(filteredChartData, symbol, chartType);
                        break;
                    case "All":
                        await (0, getCharts_1.setAllChartSeries)(filteredChartData, symbol, chartType);
                        break;
                }
            }
            else {
                asset.Symbol = symbol.replace("crypto-", "");
                data = await (0, aplha_api_1.alpha_api)("CRYPTO_INTRADAY", { key: "symbol", value: asset.Symbol }, { key: "interval", value: "30min" }, { key: "market", value: "USD" });
                switch (interval) {
                    case "1H":
                        await (0, getCharts_1.set1HourChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                    case "5H":
                        await (0, getCharts_1.set5HoursChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                    case "24H":
                        await (0, getCharts_1.setDayChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                    case "1W":
                        await (0, getCharts_1.setWeekChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                    case "15D":
                        await (0, getCharts_1.set15DaysChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                    case "1M":
                        await (0, getCharts_1.setMonthChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                    case "5M":
                        await (0, getCharts_1.set5MonthsChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                    case "1Y":
                        await (0, getCharts_1.setYearChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                    case "All":
                        await (0, getCharts_1.setAllChartSeriesCrypto)(filteredChartData, asset.Symbol, chartType);
                        break;
                }
            }
            if (data["Error Message"]) {
                continue;
            }
            const timeSeries = data[Object.keys(data)[1]];
            try {
                const lastPrice = Number(timeSeries[Object.keys(timeSeries)[0]]["4. close"]);
                const prevPrice = timeSeries[Object.keys(timeSeries)[1]]["4. close"];
                asset.lastPrice = lastPrice;
                asset.priceChange30m = lastPrice - prevPrice;
                asset.priceChangePercent30m = (lastPrice - prevPrice) / prevPrice * 100;
                asset.chartData = filteredChartData;
                if (asset.AssetType !== "Cryptocurrency") {
                    asset.logo = `https://storage.googleapis.com/iex/api/logos/${asset.Symbol}.png`;
                }
                else {
                    asset.logo = this.cryptoLogos[asset.Symbol];
                }
                await this.cacheManager.set(`getAssetData-${symbol}-${interval}`, asset, Number(process.env.getAssetDataCashPeriod));
            }
            catch (err) {
                console.log(err);
            }
        }
        return assets;
    }
    getAggregationFilter(filters = {}) {
        const aggregationFilter = {
            $expr: {
                $and: []
            }
        };
        if (filters.minMarketCap)
            aggregationFilter.$expr.$and.push({ $gte: ["$MarketCapitalization", filters.minMarketCap] });
        if (filters.maxMarketCap)
            aggregationFilter.$expr.$and.push({ $lte: ["$MarketCapitalization", filters.maxMarketCap] });
        if (filters.minVolume)
            aggregationFilter.$expr.$and.push({ $gte: ["$Volume24h", filters.minVolume] });
        if (filters.maxVolume)
            aggregationFilter.$expr.$and.push({ $lte: ["$Volume24h", filters.maxVolume] });
        if (filters.minPrice)
            aggregationFilter.$expr.$and.push({ $gte: ["$ExchangeRate", filters.minPrice] });
        if (filters.maxPrice)
            aggregationFilter.$expr.$and.push({ $lte: ["$ExchangeRate", filters.maxPrice] });
        if (filters.isCryptocurrency === false) {
            aggregationFilter.$expr.$and.push({ $ne: ['$AssetType', 'Cryptocurrency'] });
        }
        else if (filters.isCryptocurrency === true) {
            aggregationFilter.$expr.$and.push({ $eq: ["$AssetType", "Cryptocurrency"] });
        }
        if (filters.minCompanyAge)
            aggregationFilter.$expr.$and.push({ $lte: [
                    "$IpoDate",
                    (0, getDateFromYearsAgo_1.getDateFromYearsAgo)(filters.minCompanyAge)
                ] });
        if (filters.maxCompanyAge)
            aggregationFilter.$expr.$and.push({ $gte: [
                    "$IpoDate",
                    (0, getDateFromYearsAgo_1.getDateFromYearsAgo)(filters.maxCompanyAge)
                ] });
        return aggregationFilter;
    }
    async getCalibrationAssets(amount, filters, forIgnore) {
        const stockRelation = Number(process.env.stockRelation);
        const cryptoRelation = Number(process.env.cryptoRelation);
        const denominator = stockRelation + cryptoRelation;
        let stocksLimit = amount * stockRelation / denominator;
        let cryptosLimit = amount * cryptoRelation / denominator;
        if (!Math.floor(stocksLimit) || !Math.floor(cryptosLimit)) {
            cryptosLimit = 0;
            stocksLimit = 0;
            for (let i = 0; i < amount; i++) {
                const rand = Math.floor(Math.random() * denominator);
                if (rand < cryptoRelation) {
                    cryptosLimit++;
                }
                else {
                    stocksLimit++;
                }
            }
        }
        else {
            if (stocksLimit % 1 !== 0 && stocksLimit % 0.5 === 0) {
                stocksLimit = Math.ceil(stocksLimit);
            }
            else {
                stocksLimit = Math.round(stocksLimit);
            }
            if (cryptosLimit % 1 !== 0 && cryptosLimit % 0.5 === 0) {
                cryptosLimit = Math.floor(cryptosLimit);
            }
            else {
                cryptosLimit = Math.round(cryptosLimit);
            }
        }
        if (filters.isCryptocurrency === true) {
            cryptosLimit = amount;
            stocksLimit = 0;
        }
        else if (filters.isCryptocurrency === false) {
            cryptosLimit = 0;
            stocksLimit = amount;
        }
        let stocks = [];
        let cryptos = [];
        let forIgnoreObjectIds = [];
        try {
            if (forIgnore.length)
                forIgnoreObjectIds = forIgnore.map(ignoreItem => new mongoose_2.default.Types.ObjectId(ignoreItem));
        }
        catch (err) {
            throw new common_1.HttpException("Invalid currencies ids for ignore", common_1.HttpStatus.BAD_REQUEST);
        }
        if (stocksLimit) {
            stocks = await this.currencyModel.aggregate([
                { $project: {
                        news: 0
                    } },
                { $match: {
                        AssetType: {
                            $not: { $eq: 'Cryptocurrency' }
                        },
                        _id: {
                            $nin: forIgnoreObjectIds
                        },
                        ...this.getAggregationFilter(filters)
                    } },
                { $sort: {
                        MarketCapitalization: -1
                    } },
                { $limit: stocksLimit }
            ]);
        }
        if (cryptosLimit) {
            cryptos = await this.currencyModel.aggregate([
                { $project: {
                        news: 0,
                    } },
                { $match: {
                        AssetType: "Cryptocurrency",
                        _id: {
                            $nin: forIgnoreObjectIds
                        }
                    } },
                { $sort: {
                        ExchangeRate: -1
                    } },
                { $limit: cryptosLimit }
            ]);
        }
        cryptos.forEach(crypto => {
            crypto.Symbol = crypto.Symbol.replace("crypto-", "");
        });
        const assets = (0, shuffleArray_1.shuffle)([...stocks, ...cryptos]);
        return { assets: await this.getAssetData(assets), type: "calibration", amount: assets.length };
    }
    async reactToAsset(dto, userId) {
        const user = await this.userModel.findById(userId);
        const asset = await this.currencyModel.findById(dto.assetId);
        if (!asset) {
            throw new common_1.HttpException("Asset not found", common_1.HttpStatus.NOT_FOUND);
        }
        const isReactionWasRemoved = user.removedReactions.find(currency => currency.toString() === dto.assetId);
        if (dto.reaction === true) {
            if (!isReactionWasRemoved)
                asset.likes++;
            const SectorLikesIndex = user.likedSectors.findIndex(SectorLikes => SectorLikes.Sector === asset.Sector);
            if (SectorLikesIndex === -1) {
                user.likedSectors.push({
                    Sector: asset.Sector ? asset.Sector : "Cryptocurrency",
                    likes: 0
                });
            }
            else {
                user.likedSectors[SectorLikesIndex].likes++;
            }
        }
        else if (dto.reaction === false) {
            if (!isReactionWasRemoved)
                asset.dislikes++;
        }
        const foundReactionIndex = user.reactions.findIndex(reaction => reaction.asset.toString() === asset._id.toString());
        if (foundReactionIndex !== -1) {
            if (user.reactions[foundReactionIndex].isLiked === dto.reaction) {
                throw new common_1.HttpException("Already liked/disliked", common_1.HttpStatus.BAD_REQUEST);
            }
            user.reactions[foundReactionIndex].isLiked = dto.reaction;
            if (dto.reaction) {
                if (!isReactionWasRemoved)
                    asset.dislikes--;
            }
            else {
                if (!isReactionWasRemoved)
                    asset.likes--;
            }
        }
        else {
            user.reactions.push({
                asset,
                isLiked: dto.reaction
            });
        }
        await asset.save();
        await user.save();
        return foundReactionIndex !== -1 ? user.reactions[foundReactionIndex] : user.reactions[user.reactions.length - 1];
    }
    async removeReaction(assetId, userId) {
        const user = await this.userModel.findById(userId);
        const asset = await this.currencyModel.findById(assetId);
        if (!asset) {
            throw new common_1.HttpException("Asset not found", common_1.HttpStatus.NOT_FOUND);
        }
        const removedReactionIndex = user.removedReactions.findIndex(currency => currency.toString() === assetId);
        if (removedReactionIndex === -1) {
            user.removedReactions.push(asset);
        }
        const foundReactionIndex = user.reactions.findIndex(reaction => reaction.asset.toString() === asset._id.toString());
        if (foundReactionIndex === -1)
            throw new common_1.HttpException("The asset was not even liked or disliked", common_1.HttpStatus.BAD_REQUEST);
        if (user.reactions[foundReactionIndex].isLiked) {
            asset.likes--;
        }
        else {
            asset.dislikes--;
        }
        user.reactions.splice(foundReactionIndex, 1);
        await asset.save();
        await user.save();
        return { message: "saved" };
    }
};
AlphavantageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(currency_schema_1.Currency.name)),
    __param(2, (0, mongoose_1.InjectModel)(news_schema_1.News.name)),
    __param(3, (0, mongoose_1.InjectModel)(currentStat_schema_1.CurrentStat.name)),
    __param(4, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model, Object])
], AlphavantageService);
exports.AlphavantageService = AlphavantageService;
//# sourceMappingURL=alphavantage.service.js.map