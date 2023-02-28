import { FiltersDto } from "./Filters.dto";
export declare class GetRecommendationDto {
    forIgnore?: string[];
    amount: number;
    filters?: FiltersDto;
    type?: string;
}
