declare class paramDto {
    key: string;
    value: string;
}
export declare function alpha_api(func: string, ...params: paramDto[] | undefined): Promise<any>;
export {};
