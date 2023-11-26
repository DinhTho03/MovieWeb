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
exports.GenreSchema = exports.Genre = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const mongoose_2 = require("mongoose");
let Genre = class Genre extends mongoose_2.Document {
};
exports.Genre = Genre;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Genre.prototype, "name", void 0);
exports.Genre = Genre = __decorate([
    (0, mongoose_1.Schema)()
], Genre);
exports.GenreSchema = mongoose_1.SchemaFactory.createForClass(Genre);
//# sourceMappingURL=genre.schema.js.map