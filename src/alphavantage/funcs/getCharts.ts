import { alpha_api } from "./aplha_api";

export async function getAssetData24h(symbol: string) {
  try {
    const result: any = {};

    let chartData = await alpha_api(
      "TIME_SERIES_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "outputsize", value: "full" },
      { key: "interval", value: "60min" }
    );
    while(chartData.Note) {
      await new Promise(resolve => setTimeout(resolve, Number(process.env.reRequestDelay)));
      chartData = await alpha_api(
        "TIME_SERIES_INTRADAY",
        { key: "symbol", value: symbol },
        { key: "outputsize", value: "full" },
        { key: "interval", value: "60min" }
      );
    }

    const chartSeries = chartData["Time Series (60min)"];
    const lastItem = Object.keys(chartSeries)[0];


    // result.Volume24h = Number(chartSeries[lastItem]["5. volume"]);
    result.ExchangeRate = Number(chartSeries[lastItem]["4. close"]);

    let volume24h = 0;
    let sumExchangeRate = 0;
    let lengthExchangeRate = 0;
    let avExchangeRate48h = 0;
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 86400000) {
        volume24h += Number(chartSeries[item]["5. volume"]);
      }

      if(!avExchangeRate48h && new Date().getTime() - date.getTime() >= 172800000) {
        avExchangeRate48h = sumExchangeRate / lengthExchangeRate;
      }

      if(new Date().getTime() - date.getTime() < 2628000000) {
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
  } catch (err) {
    return null;
  }
}

export async function set5HoursChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "interval", value: "5min" }
    );
    const chartSeries = chartData["Time Series (5min)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 18000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function set5HoursChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "CRYPTO_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "interval", value: "5min" },
      { key: "market", value: "USD" }
    );
    const chartSeries = chartData["Time Series Crypto (5min)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 18000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}

export async function set1HourChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "interval", value: "1min" }
    );
    const chartSeries = chartData["Time Series (1min)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 3600000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function set1HourChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "CRYPTO_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "interval", value: "1min" },
      { key: "market", value: "USD" }
    );
    const chartSeries = chartData["Time Series Crypto (1min)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 3600000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}

export async function setDayChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "interval", value: "5min" }
    );
    const chartSeries = chartData["Time Series (5min)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 86400000) {
        console.log(chartSeries[item]);

        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function setDayChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "CRYPTO_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "interval", value: "5min" },
      { key: "market", value: "USD" }
    );
    const chartSeries = chartData["Time Series Crypto (5min)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 86400000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}

export async function setWeekChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "interval", value: "60min" }
    );
    const chartSeries = chartData["Time Series (60min)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 604800000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function setWeekChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "CRYPTO_INTRADAY",
      { key: "symbol", value: symbol },
      { key: "interval", value: "60min" },
      { key: "market", value: "USD" }
    );
    const chartSeries = chartData["Time Series Crypto (60min)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 604800000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}

export async function set15DaysChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_DAILY",
      { key: "symbol", value: symbol }
    );
    const chartSeries = chartData["Time Series (Daily)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 1296000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function set15DaysChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "DIGITAL_CURRENCY_DAILY",
      { key: "symbol", value: symbol },
      { key: "market", value: "USD" },
    );
    const chartSeries = chartData["Time Series (Digital Currency Daily)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 1296000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}

export async function setMonthChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_DAILY",
      { key: "symbol", value: symbol }
    );
    const chartSeries = chartData["Time Series (Daily)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 2628000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function setMonthChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "DIGITAL_CURRENCY_DAILY",
      { key: "symbol", value: symbol },
      { key: "market", value: "USD" }
    );
    const chartSeries = chartData["Time Series (Digital Currency Daily)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 2628000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}

export async function set5MonthsChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_DAILY",
      { key: "symbol", value: symbol }
    );
    const chartSeries = chartData["Time Series (Daily)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 13140000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function set5MonthsChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "DIGITAL_CURRENCY_DAILY",
      { key: "symbol", value: symbol },
      { key: "market", value: "USD" }
    );
    const chartSeries = chartData["Time Series (Digital Currency Daily)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 13140000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}

export async function setYearChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_WEEKLY",
      { key: "symbol", value: symbol }
    );
    const chartSeries = chartData["Weekly Time Series"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 31540000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function setYearChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "DIGITAL_CURRENCY_WEEKLY",
      { key: "symbol", value: symbol },
      { key: "market", value: "USD" }
    );
    const chartSeries = chartData["Time Series (Digital Currency Weekly)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      if(new Date(lastItem).getTime() - date.getTime() < 31540000000) {
        filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
        continue;
      }

      break;
    }
  } catch (err) {
    filteredChartData = [];
  }
}
export async function setAllChartSeries(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "TIME_SERIES_MONTHLY",
      { key: "symbol", value: symbol }
    );
    const chartSeries = chartData["Monthly Time Series"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4. close"]) : chartSeries[item];
    }
  } catch (err) {
    filteredChartData = [];
  }
}

export async function setAllChartSeriesCrypto(filteredChartData, symbol, chartType: string) {
  try {
    const chartData = await alpha_api(
      "DIGITAL_CURRENCY_MONTHLY",
      { key: "symbol", value: symbol },
      { key: "market", value: "USD" }
    );
    const chartSeries = chartData["Time Series (Digital Currency Monthly)"];

    const lastItem = Object.keys(chartSeries)[0];
    for(const item in chartSeries) {
      const date = new Date(item);
      filteredChartData[item] = chartType === "regular" ? Number(chartSeries[item]["4b. close (USD)"]) : chartSeries[item];
    }
  } catch (err) {
    filteredChartData = [];
  }
}