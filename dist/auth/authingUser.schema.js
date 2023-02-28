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
exports.AuthingUserSchema = exports.AuthingUser = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const dotenv = require("dotenv");
dotenv.config();
let AuthingUser = class AuthingUser {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], AuthingUser.prototype, "mobileNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, unique: true, required: true }),
    __metadata("design:type", String)
], AuthingUser.prototype, "authToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, select: false }),
    __metadata("design:type", String)
], AuthingUser.prototype, "verificationCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 1 }),
    __metadata("design:type", Number)
], AuthingUser.prototype, "sentConfirmations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], AuthingUser.prototype, "prevCodeTime", void 0);
AuthingUser = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AuthingUser);
exports.AuthingUser = AuthingUser;
exports.AuthingUserSchema = mongoose_1.SchemaFactory.createForClass(AuthingUser);
//# sourceMappingURL=authingUser.schema.js.map