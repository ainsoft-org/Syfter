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
exports.ChartIntervalDto = exports.ChartIntervals = void 0;
const class_validator_1 = require("class-validator");
var ChartIntervals;
(function (ChartIntervals) {
    ChartIntervals[ChartIntervals["24H"] = 0] = "24H";
    ChartIntervals[ChartIntervals["1H"] = 1] = "1H";
    ChartIntervals[ChartIntervals["5H"] = 2] = "5H";
    ChartIntervals[ChartIntervals["15D"] = 3] = "15D";
    ChartIntervals[ChartIntervals["1M"] = 4] = "1M";
    ChartIntervals[ChartIntervals["1W"] = 5] = "1W";
    ChartIntervals[ChartIntervals["5M"] = 6] = "5M";
    ChartIntervals[ChartIntervals["1Y"] = 7] = "1Y";
    ChartIntervals[ChartIntervals["All"] = 8] = "All";
})(ChartIntervals = exports.ChartIntervals || (exports.ChartIntervals = {}));
class ChartIntervalDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(ChartIntervals, {
        message: `must be 1H|5H|24H|1W|15D|1M|5M|1Y|All`
    }),
    __metadata("design:type", String)
], ChartIntervalDto.prototype, "interval", void 0);
exports.ChartIntervalDto = ChartIntervalDto;
//# sourceMappingURL=ChartInterval.dto.js.map