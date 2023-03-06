import { ChartIntervalDto } from "./ChartInterval.dto";
export declare enum ChartTypes {
    "regular" = 0,
    "candlestick" = 1
}
export declare class GetAssetDataDto extends ChartIntervalDto {
    assets: string[];
    chartType?: string;
}
