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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAssetDataDto = exports.ChartTypes = void 0;
const class_validator_1 = require("class-validator");
const ChartInterval_dto_1 = require("./ChartInterval.dto");
var ChartTypes;
(function (ChartTypes) {
    ChartTypes[ChartTypes["regular"] = 0] = "regular";
    ChartTypes[ChartTypes["candlestick"] = 1] = "candlestick";
})(ChartTypes = exports.ChartTypes || (exports.ChartTypes = {}));
class GetAssetDataDto extends ChartInterval_dto_1.ChartIntervalDto {
}
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GetAssetDataDto.prototype, "assets", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(ChartTypes, {
        message: `must be regular|candlestick`
    }),
    __metadata("design:type", String)
], GetAssetDataDto.prototype, "chartType", void 0);
exports.GetAssetDataDto = GetAssetDataDto;
//# sourceMappingURL=GetAssetData.dto.js.map