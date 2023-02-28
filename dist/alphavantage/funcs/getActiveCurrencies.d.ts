declare class currencyDto {
    symbol: string;
    name: string;
    exchange: string;
    assetType: string;
    ipoDate: string;
    delistingDate: string;
    status: string;
}
export declare function getCurrencies(): Promise<any[]>;
export declare function getNews(assets: string, limit?: number, from?: Date, to?: Date): Promise<any>;
export declare function getCryptoCurrencies(): Promise<currencyDto[] | null>;
export {};
