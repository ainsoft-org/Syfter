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
exports.UserSchema = exports.User = exports.SectorLikes = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const Period_dto_1 = require("../sessions/dto/Period.dto");
const UserRole_dto_1 = require("../auth/dto/UserRole.dto");
const currency_schema_1 = require("../alphavantage/currency.schema");
let Reaction = class Reaction {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "currency", required: true }),
    __metadata("design:type", currency_schema_1.Currency)
], Reaction.prototype, "asset", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, required: true }),
    __metadata("design:type", Boolean)
], Reaction.prototype, "isLiked", void 0);
Reaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Reaction);
const ReactionSchema = mongoose_1.SchemaFactory.createForClass(Reaction);
let SectorLikes = class SectorLikes {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], SectorLikes.prototype, "Sector", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 1 }),
    __metadata("design:type", Number)
], SectorLikes.prototype, "likes", void 0);
SectorLikes = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SectorLikes);
exports.SectorLikes = SectorLikes;
const SectorLikesSchema = mongoose_1.SchemaFactory.createForClass(SectorLikes);
let User = class User {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }] }),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }] }),
    __metadata("design:type", Array)
], User.prototype, "likedComments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }] }),
    __metadata("design:type", Array)
], User.prototype, "dislikedComments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ReactionSchema] }),
    __metadata("design:type", Array)
], User.prototype, "reactions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "currency" }] }),
    __metadata("design:type", Array)
], User.prototype, "removedReactions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "news" }] }),
    __metadata("design:type", Array)
], User.prototype, "dislikedNews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "news" }] }),
    __metadata("design:type", Array)
], User.prototype, "likedNews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "news" }] }),
    __metadata("design:type", Array)
], User.prototype, "removedLikedNews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "currency" }] }),
    __metadata("design:type", Array)
], User.prototype, "favourites", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SectorLikesSchema] }),
    __metadata("design:type", Array)
], User.prototype, "likedSectors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "mobileNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, select: false, length: 4 }),
    __metadata("design:type", String)
], User.prototype, "pin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: UserRole_dto_1.UserRole, default: UserRole_dto_1.UserRole[0], select: false }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
__decorate([
    (0, mongoose_1.Prop)(String),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, select: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false, select: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailConfirmed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "acceptNotifications", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }], select: false }),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: Period_dto_1.Period, default: Period_dto_1.Period[0] }),
    __metadata("design:type", String)
], User.prototype, "sessionTerminationTimeframe", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: new Date() }),
    __metadata("design:type", Date)
], User.prototype, "lastActivity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }], select: false }),
    __metadata("design:type", Array)
], User.prototype, "addresses", void 0);
User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map