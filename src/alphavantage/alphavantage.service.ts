import { HttpException, HttpStatus, Injectable, CACHE_MANAGER, Inject } from "@nestjs/common";
import { Cache } from 'cache-manager';
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Currency, CurrencyDocument } from "./currency.schema";
import { refreshCurrencies, refreshCryptoCurrencies } from "./funcs/refreshCurrencies";
import { News, NewsDocument } from "../news/news.schema";
import { CurrentStat, CurrentStatDocument } from "./currentStat.schema";
import { SectorLikes, User, UserDocument } from "../user/user.schema";
import { shuffle } from "../common/shuffleArray";
import { alpha_api } from "./funcs/aplha_api";
import {
  set15DaysChartSeries,
  set15DaysChartSeriesCrypto,
  set1HourChartSeries, set1HourChartSeriesCrypto, set5HoursChartSeries, set5HoursChartSeriesCrypto,
  set5MonthsChartSeries, set5MonthsChartSeriesCrypto,
  setAllChartSeries, setAllChartSeriesCrypto,
  setDayChartSeries, setDayChartSeriesCrypto, setMonthChartSeries, setMonthChartSeriesCrypto,
  setWeekChartSeries, setWeekChartSeriesCrypto,
  setYearChartSeries, setYearChartSeriesCrypto
} from "./funcs/getCharts";
import { FiltersDto } from "./dto/Filters.dto";
import { getDateFromYearsAgo } from "./funcs/getDateFromYearsAgo";
import { ReactToAssetDto } from "./dto/ReactToAsset.dto";
import { getRecommendationsML } from "./machine_learning";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class AlphavantageService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Currency.name) private currencyModel: Model<CurrencyDocument>,
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
    @InjectModel(CurrentStat.name) private currentStatModel: Model<CurrentStatDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    const now = new Date();
    const nextDay = new Date();
    nextDay.setDate(now.getDate() + 1); nextDay.setHours(0);
    nextDay.setMinutes(0); nextDay.setSeconds(0);

    refreshCurrencies(currencyModel, newsModel, currentStatModel);
    setTimeout(() => {
      refreshCurrencies(currencyModel, newsModel, currentStatModel);
      setInterval(() => {
        refreshCurrencies(currencyModel, newsModel, currentStatModel);
      }, Number(process.env.refreshAssetsEvery));
    }, nextDay.getTime() - now.getTime());

    refreshCryptoCurrencies(currencyModel, newsModel);
    setTimeout(() => {
      refreshCryptoCurrencies(currencyModel, newsModel);
      setInterval(() => {
        refreshCryptoCurrencies(currencyModel, newsModel);
      }, Number(process.env.refreshCryptosEvery));
    }, nextDay.getTime() - now.getTime());

    const cryptoLogosText = fs.readFileSync(path.join(__dirname, '../common/cryptoLogos.json')).toString();
    this.cryptoLogos  = JSON.parse(cryptoLogosText);
  }

  private cryptoLogos = null;

  async getRecommendation(userId: string, filters: FiltersDto, amount = 1, forIgnore: string[] = [], type = "") {
    if(amount <= 0) {
      throw new HttpException("field amount must be positive", HttpStatus.BAD_REQUEST);
    }

    const user: any = await this.userModel.findById(userId);
    if(user.reactions.length <= 8) {
      return await this.getCalibrationAssets(amount, filters, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())]);
    }

    const randomNumber = Math.random();
    if((randomNumber >=0 && randomNumber <0.075 && type === "") || type === "TOP_CAPITALIZATION") {
      return await this.getCalibrationAssets(amount, filters, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())]);
    }
    else if((randomNumber >= 0.075 && randomNumber < 0.15 && type === "") || type === "NEW_COMPANIES") {
      return await this.getNewCompaniesFavouriteSubcategories(amount, filters, user.likedSectors, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())]);
    }
    else if((randomNumber >= 0.15 && randomNumber < 0.25 && type === "") || type === "RERECOMMENDATION") {
      return await this.getReRecommendation(user, amount, forIgnore, filters);
    }
    else if((randomNumber >= 0.25 && randomNumber < 0.5 && type === "") || type === "PRICE_INCREASE") {
      return this.getRecByPriceIncrease(amount, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())], filters);
    }
    else if((randomNumber >= 0.5 && randomNumber < 0.75 && type === "") || type === "NEWS_INCREASE") {
      return this.getRecByNewsIncrease(amount, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())], filters);
    }
    else if((randomNumber >= 0.75 && randomNumber <= 1 && type === "") || type === "MACHINE_LEARNING") {
      return await this.getAssetsBySimilarUsers(userId, forIgnore, user, amount, filters);
    }

    return null;
  }

  async getWatchlist(userId: string, amount: number, forIgnore = [], filters = {}) {
    const user = await this.userModel.findById(userId).select("reactions");
    const likedReactions = user.reactions.filter((reaction) => reaction.isLiked === true && reaction.asset !== null);

    const assets = await this.currencyModel.aggregate([
      {$match: {
        _id: {
          $in: likedReactions.map(reaction => reaction.asset),
          $nin: forIgnore.map(asset => new mongoose.Types.ObjectId(asset)),
        },
        ...this.getAggregationFilter(filters)
      }},
      // {$addFields: {
      //   reactions: likedReactions
      // }},
      {$addFields: {
        position: {
          $indexOfArray: [
            likedReactions.map(reaction => reaction.asset),
            "$_id"
          ]
          // $function: {
          //   body: function(reactions, id) {
          //     return reactions.findIndex(reaction => reaction.asset.toString() === id.toString())
          //   },
          //   args: ["$reactions", "$_id"],
          //   lang: "js"
          // }
        }
      }},
      {$sort: {
        position: 1
      }},
      {$limit: amount},
      {$unset: ["news", "reactions"]}
    ]);

    return { assets: await this.getAssetData(assets), amount: assets.length };
  }

  async getFavourites(userId: string, amount: number, forIgnore = [], filters = {}) {
    const user = await this.userModel.findById(userId).select("favourites");

    const assets = await this.currencyModel.aggregate([
      {$match: {
        _id: {
          $in: user.favourites,
          $nin: forIgnore.map(asset => new mongoose.Types.ObjectId(asset)),
        },
        ...this.getAggregationFilter(filters)
      }},
      {$addFields: {
        favourites: user.favourites
      }},
      {$addFields: {
        position: {
          $indexOfArray: [
            user.favourites,
            "$_id"
          ]
          // $function: {
          //   body: function(favourites, id) {
          //     return favourites.findIndex(favourite => favourite.toString() === id.toString())
          //   },
          //   args: ["$favourites", "$_id"],
          //   lang: "js"
          // }
        }
        }},
      {$sort: {
        position: 1
      }},
      {$limit: amount},
      {$unset: ["news", "favourites"]}
    ]);

    return { assets: await this.getAssetData(assets), amount: assets.length };
  }

  async addAssetToFavourites(userId: string, assetId: string) {
    const user = await this.userModel.findById(userId);
    const asset = await this.currencyModel.findById(assetId);
    if(!asset) throw new HttpException("Asset not found", HttpStatus.NOT_FOUND);

    const favouriteIndex = user.favourites.findIndex(favourite => favourite.toString() === assetId);
    if(favouriteIndex !== -1) {
      throw new HttpException("Asset already in favourites", HttpStatus.BAD_REQUEST);
    }

    user.favourites.push(asset);
    await user.save();
    return user.favourites;
  }
  async removeFavourite(userId: string, assetId: string) {
    const user = await this.userModel.findById(userId);
    const asset = await this.currencyModel.findById(assetId);
    if(!asset) throw new HttpException("Asset not found", HttpStatus.NOT_FOUND);

    const favouriteIndex = user.favourites.findIndex(favourite => favourite.toString() === assetId);
    if(favouriteIndex === -1) {
      throw new HttpException("Asset is not in favourites", HttpStatus.BAD_REQUEST);
    }

    user.favourites.splice(favouriteIndex, 1);
    await user.save();
    return user.favourites;
  }

  async setAssetPriority(assetId: string, priority: number) {
    const asset = await this.currencyModel.findById(assetId);
    if(!asset) throw new HttpException("Asset not found", HttpStatus.NOT_FOUND);
    asset.priority = priority;
    await asset.save();
    return asset;
  }

  async getTrendingNow(amount: number, forIgnore = [], filters = {}) {
    if(!forIgnore.length && !Object.keys(filters).length) {
      const cashed_assets: any = await this.cacheManager.get(amount + "trendingAssets");
      if (cashed_assets) {
        return { assets: await this.getAssetData(cashed_assets), amount: cashed_assets.length };
      }
    }

    const assets = await this.currencyModel.aggregate([
      {$match: {
        _id: {
          $nin: forIgnore.map(asset => new mongoose.Types.ObjectId(asset))
        },
        ...this.getAggregationFilter(filters)
      }},
      {$sort: {
        priority: -1,
        likes: -1
      }},
      {$limit: amount},
      {$unset: ["news"]}
    ]);

    if(!forIgnore.length && !Object.keys(filters).length) {
      await this.cacheManager.set(amount + "trendingAssets", assets, 3600000);
    }
    return { assets: await this.getAssetData(assets), amount: assets.length };
  }

  async getRecByPriceIncrease(amount, forIgnore, filters) {
    const assets = await this.currencyModel.aggregate([
      {$match: {
        _id: {
          $nin: forIgnore.map(asset => new mongoose.Types.ObjectId(asset))
        },
        ...this.getAggregationFilter(filters)
      }},
      {$unset: ["news"]},
      {$sort: {
        boomRatio: -1
      }},
      {$limit: amount}
    ]);

    return { assets: await this.getAssetData(assets), type: "PRICE_INCREASE", amount: assets.length };
  }

  async getRecByNewsIncrease(amount, forIgnore, filters) {
    const assets = await this.currencyModel.aggregate([
      {$match: {
        _id: {
          $nin: forIgnore.map(asset => new mongoose.Types.ObjectId(asset))
        },
        ...this.getAggregationFilter(filters)
      }},
      {$unset: ["news"]},
      {$sort: {
        newsBoomRatio: -1
      }},
      {$limit: amount}
    ]);

    return { assets: await this.getAssetData(assets), type: "NEWS_INCREASE", amount: assets.length };
  }

  async getReRecommendation(user, amount, forIgnore, filters) {
    const negativeReactions = [];
    for(let i=0; i<user.reactions.length; i++) {
      const reactionDate = new Date(user.reactions[i].createdAt);
      const reRecommendMinPeriod = 0; // Number(process.env.reRecommendAssetAfterMilliseconds)
      if(!user.reactions[i].isLiked && new Date().getTime() - reactionDate.getTime() >= reRecommendMinPeriod ) {
        negativeReactions.push(user.reactions[i].asset.toString());
      }
    }

    const assets = await this.getAssetsByIds(shuffle(negativeReactions), forIgnore, amount, filters);
    return { assets: assets, type: "RERECOMMENDATION", amount: assets.length };
  }

  async getAssetsByIds(assetIds, forIgnore, amount, filters) {
    const assets = await this.currencyModel.aggregate([
      {$match: {
        _id: {
          $in: assetIds.map(assetId => new mongoose.Types.ObjectId(assetId)),
          $nin: forIgnore.map(asset => new mongoose.Types.ObjectId(asset))
        },
        ...this.getAggregationFilter(filters)
        }},
      {$unset: ["news"]},
      {$limit: amount}
    ]);

    return await this.getAssetData(assets);
  }

  async getAssetsBySimilarUsers(userId: string, forIgnore, user, amount, filters) {
    const allUsers = await this.userModel.find();
    const assetIds = getRecommendationsML(allUsers, userId, [...forIgnore, ...user.reactions.map(reaction => reaction.asset.toString())]);

    const assets = await this.currencyModel.aggregate([
      {$match: {
        _id: {
          $in: assetIds.map(assetId => new mongoose.Types.ObjectId(assetId.name))
        },
        ...this.getAggregationFilter(filters)
      }},
      {$unset: ["news"]},
      {$limit: amount}
    ]);

    return { assets: await this.getAssetData(assets), type: "MACHINE_LEARNING", amount: assets.length };
  }

  async getNewCompaniesFavouriteSubcategories(amount: number, filters, likedSectors: SectorLikes[], forIgnore: string[] = []) {
    let forIgnoreObjectIds = [];
    try {
      forIgnoreObjectIds = forIgnore.map(ignoreItem => new mongoose.Types.ObjectId(ignoreItem));
    } catch (err) {
      throw new HttpException("Invalid currencies ids for ignore", HttpStatus.BAD_REQUEST);
    }

    const assets = await this.currencyModel.aggregate([
      {$match: {
        _id: {
          $nin: forIgnoreObjectIds
        },
        ...this.getAggregationFilter(filters)
      }},
      {$unset: ["news"]},
      {$addFields: {
        favouriteSectorCoeff: {
          // $function: {
          //   body: function(Sector, likedSectors) {
          //     const sectorLikes = likedSectors.find(sector => sector.Sector === Sector)
          //     if(!sectorLikes) return 0;
          //     return sectorLikes.likes;
          //   },
          //   args: ["$Sector", likedSectors],
          //   lang: "js"
          // }
          $let: {
            vars: {
              likedSectors: {
                $filter: {
                  input: likedSectors,
                  as: "likedSector",
                  cond: {$eq: ["$$likedSector.Sector", "$Sector"]}
                }
              }
            },
            in: {
              $cond: [
                {$gt: [{$size: "$$likedSectors"}, 0]},
                {$arrayElemAt: ["$$likedSectors.likes", 0]},
                0
              ]
            }
          }
        }
      }},
      {$sort: {
        favouriteSectorCoeff: -1,
        IpoDate: -1
      }},
      {$limit: amount}
    ]);

    return { assets: await this.getAssetData(assets), type: "NEW_COMPANIES", amount: assets.length };
  }

  async getAssetsById(assets: string[]) {
    const result: any = [];
    try {
      for(const asset of assets) {
        const foundAsset = await this.currencyModel.findById(asset);
        if(foundAsset) {
          result.push(foundAsset);
        }
      }
      return result;
    } catch (err) {
      throw new HttpException("Invalid id one of assets", HttpStatus.BAD_REQUEST);
    }
  }

  async getAssetData(assets: any[], interval = "24H", chartType = "regular") {
    for(let i=0; i<assets.length; i++) {
      try {
        assets[i] = assets[i].toObject()
      } catch (err) {}

      const asset = assets[i];
      const symbol = asset.Symbol;

      const cashed_asset = await this.cacheManager.get(`getAssetData-${symbol}-${interval}`);
      if (cashed_asset) {
        assets[i] = cashed_asset;
        continue;
      }

      let data;
      const filteredChartData = {};
      if(asset.AssetType !== "Cryptocurrency") {
        data = await alpha_api(
          "TIME_SERIES_INTRADAY",
          { key: "symbol", value: symbol },
          { key: "interval", value: "30min" }
        )
        switch (interval) {
          case "1H":
            await set1HourChartSeries(filteredChartData, symbol, chartType);
            break;
          case "5H":
            await set5HoursChartSeries(filteredChartData, symbol, chartType);
            break;
          case "24H":
            await setDayChartSeries(filteredChartData, symbol, chartType);
            break;
          case "1W":
            await setWeekChartSeries(filteredChartData, symbol, chartType);
            break;
          case "15D":
            await set15DaysChartSeries(filteredChartData, symbol, chartType);
            break;
          case "1M":
            await setMonthChartSeries(filteredChartData, symbol, chartType);
            break;
          case "5M":
            await set5MonthsChartSeries(filteredChartData, symbol, chartType);
            break;
          case "1Y":
            await setYearChartSeries(filteredChartData, symbol, chartType);
            break;
          case "All":
            await setAllChartSeries(filteredChartData, symbol, chartType);
            break;
        }
      } else {
        asset.Symbol = symbol.replace("crypto-", "");
        data = await alpha_api(
          "CRYPTO_INTRADAY",
          { key: "symbol", value: asset.Symbol },
          { key: "interval", value: "30min" },
          { key: "market", value: "USD" }
        )
        switch (interval) {
          case "1H":
            await set1HourChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
          case "5H":
            await set5HoursChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
          case "24H":
            await setDayChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
          case "1W":
            await setWeekChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
          case "15D":
            await set15DaysChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
          case "1M":
            await setMonthChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
          case "5M":
            await set5MonthsChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
          case "1Y":
            await setYearChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
          case "All":
            await setAllChartSeriesCrypto(filteredChartData, asset.Symbol, chartType);
            break;
        }
      }

      if(data["Error Message"]) {
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
        if(asset.AssetType !== "Cryptocurrency") {
          asset.logo = `https://storage.googleapis.com/iex/api/logos/${asset.Symbol}.png`;
        } else {
          asset.logo = this.cryptoLogos[asset.Symbol];
        }

        await this.cacheManager.set(`getAssetData-${symbol}-${interval}`, asset, Number(process.env.getAssetDataCashPeriod));
      } catch (err) {
        console.log(err);
      }
    }

    return assets;

  }


  getAggregationFilter(filters: any = {}) {
    const aggregationFilter = {
      $expr: {
        $and: []
      }
    }

    if(filters.minMarketCap) aggregationFilter.$expr.$and.push({ $gte: ["$MarketCapitalization", filters.minMarketCap] });
    if(filters.maxMarketCap) aggregationFilter.$expr.$and.push({ $lte: ["$MarketCapitalization", filters.maxMarketCap] });
    if(filters.minVolume) aggregationFilter.$expr.$and.push({ $gte: ["$Volume24h", filters.minVolume] });
    if(filters.maxVolume) aggregationFilter.$expr.$and.push({ $lte: ["$Volume24h", filters.maxVolume] });
    if(filters.minPrice) aggregationFilter.$expr.$and.push({ $gte: ["$ExchangeRate", filters.minPrice] });
    if(filters.maxPrice) aggregationFilter.$expr.$and.push({ $lte: ["$ExchangeRate", filters.maxPrice] });
    if(filters.isCryptocurrency === false) {
      aggregationFilter.$expr.$and.push({ $ne: ['$AssetType', 'Cryptocurrency'] });
    } else if(filters.isCryptocurrency === true) {
      aggregationFilter.$expr.$and.push({ $eq: ["$AssetType", "Cryptocurrency"] });
    }

    if(filters.minCompanyAge) aggregationFilter.$expr.$and.push({ $lte: [
      "$IpoDate",
      getDateFromYearsAgo(filters.minCompanyAge)
    ]});
    if(filters.maxCompanyAge) aggregationFilter.$expr.$and.push({ $gte: [
      "$IpoDate",
      getDateFromYearsAgo(filters.maxCompanyAge)
    ]});

    return aggregationFilter;
  }

  async getCalibrationAssets(amount: number, filters, forIgnore: string[]) {
    const stockRelation = Number(process.env.stockRelation);
    const cryptoRelation = Number(process.env.cryptoRalation);
    const denominator = stockRelation + cryptoRelation;

    let stocksLimit = amount * stockRelation/denominator;
    let cryptosLimit = amount * cryptoRelation/denominator;

    if(!Math.floor(stocksLimit) || !Math.floor(cryptosLimit)) {
      cryptosLimit = 0;
      stocksLimit = 0;
      for(let i=0; i<amount; i++) {
        const rand = Math.floor(Math.random() * denominator);
        if(rand < cryptoRelation) {
          cryptosLimit++;
        } else {
          stocksLimit++;
        }
      }
    } else {
      if(stocksLimit % 1 !== 0 && stocksLimit % 0.5 === 0) {
        stocksLimit = Math.ceil(stocksLimit);
      } else {
        stocksLimit = Math.round(stocksLimit);
      }

      if(cryptosLimit % 1 !== 0 && cryptosLimit % 0.5 === 0) {
        cryptosLimit = Math.floor(cryptosLimit);
      } else {
        cryptosLimit = Math.round(cryptosLimit);
      }
    }

    if(filters.isCryptocurrency === true) {
      cryptosLimit = amount;
      stocksLimit = 0;
    } else if(filters.isCryptocurrency === false) {
      cryptosLimit = 0;
      stocksLimit = amount;
    }

    let stocks = [];
    let cryptos = [];
    let forIgnoreObjectIds = [];

    try {
      if(forIgnore.length) forIgnoreObjectIds = forIgnore.map(ignoreItem => new mongoose.Types.ObjectId(ignoreItem));
    } catch (err) {
      throw new HttpException("Invalid currencies ids for ignore", HttpStatus.BAD_REQUEST);
    }

    if(stocksLimit) {
      stocks = await this.currencyModel.aggregate([
        {$project: {
          news: 0
        }},
        {$match: {
          AssetType: {
            $not: { $eq: 'Cryptocurrency' }
          },
          _id: {
            $nin: forIgnoreObjectIds
          },
          ...this.getAggregationFilter(filters)
        }},
        {$sort: {
          MarketCapitalization: -1
        }},
        {$limit: stocksLimit}
      ]);
    }

    if(cryptosLimit) {
      cryptos = await this.currencyModel.aggregate([
        {$project: {
          news: 0,
        }},
        {$match: {
          AssetType: "Cryptocurrency",
          _id: {
            $nin: forIgnoreObjectIds
          }
        }},
        {$sort: {
          ExchangeRate: -1
        }},
        {$limit: cryptosLimit}
      ]);
    }

    cryptos.forEach(crypto => {
      crypto.Symbol = crypto.Symbol.replace("crypto-", "")
    });

    const assets = shuffle([...stocks, ...cryptos]);
    return { assets: await this.getAssetData(assets), type: "calibration", amount: assets.length };
  }


  async reactToAsset(dto: ReactToAssetDto, userId: string) {
    const user = await this.userModel.findById(userId);
    const asset = await this.currencyModel.findById(dto.assetId);
    if(!asset) {
      throw new HttpException("Asset not found", HttpStatus.NOT_FOUND);
    }

    const isReactionWasRemoved = user.removedReactions.find(currency => currency.toString() === dto.assetId);

    if(dto.reaction === true){
      if(!isReactionWasRemoved) asset.likes++;

      const SectorLikesIndex = user.likedSectors.findIndex(SectorLikes => SectorLikes.Sector === asset.Sector);
      if(SectorLikesIndex === -1) {
        // if(asset.Sector) {
          user.likedSectors.push({
            Sector: asset.Sector ? asset.Sector : "Cryptocurrency",
            // Sector: asset.Sector,
            likes: 0
          });
        // }
      } else {
        user.likedSectors[SectorLikesIndex].likes++;
      }
    } else if(dto.reaction === false){
      if(!isReactionWasRemoved) asset.dislikes++;
    }

    const foundReactionIndex = user.reactions.findIndex(reaction => reaction.asset.toString() === asset._id.toString());
    if(foundReactionIndex !== -1) {
      if(user.reactions[foundReactionIndex].isLiked === dto.reaction) {
        throw new HttpException("Already liked/disliked", HttpStatus.BAD_REQUEST);
      }
      user.reactions[foundReactionIndex].isLiked = dto.reaction;

      if(dto.reaction) {
        if(!isReactionWasRemoved) asset.dislikes--;
      } else {
        if(!isReactionWasRemoved) asset.likes--;
      }
    } else {
      user.reactions.push({
        asset,
        isLiked: dto.reaction
      });
    }

    await asset.save();
    await user.save();

    return foundReactionIndex !== -1 ? user.reactions[foundReactionIndex] : user.reactions[user.reactions.length-1];
  }

  async removeReaction(assetId: string, userId: string) {
    const user = await this.userModel.findById(userId);
    const asset = await this.currencyModel.findById(assetId);
    if(!asset) {
      throw new HttpException("Asset not found", HttpStatus.NOT_FOUND);
    }

    const removedReactionIndex = user.removedReactions.findIndex(currency => currency.toString() === assetId);
    if(removedReactionIndex === -1) {
      user.removedReactions.push(asset);
    }

    const foundReactionIndex = user.reactions.findIndex(reaction => reaction.asset.toString() === asset._id.toString());
    if(foundReactionIndex === -1) throw new HttpException("The asset was not even liked or disliked", HttpStatus.BAD_REQUEST);

    if(user.reactions[foundReactionIndex].isLiked) {
      asset.likes--;
    } else {
      asset.dislikes--;
    }

    user.reactions.splice(foundReactionIndex, 1);

    await asset.save();
    await user.save();

    return { message: "saved" };
  }






}

