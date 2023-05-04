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
exports.PeriodDto = exports.Period = void 0;
const class_validator_1 = require("class-validator");
var Period;
(function (Period) {
    Period[Period["6months"] = 0] = "6months";
    Period[Period["week"] = 1] = "week";
    Period[Period["month"] = 2] = "month";
    Period[Period["3months"] = 3] = "3months";
})(Period = exports.Period || (exports.Period = {}));
class PeriodDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Period, {
        message: `must be week|month|3months|6months`
    }),
    __metadata("design:type", String)
], PeriodDto.prototype, "period", void 0);
exports.PeriodDto = PeriodDto;
//# sourceMappingURL=Period.dto.js.map