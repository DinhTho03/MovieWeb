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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const user_schema_1 = require("../../database/schemas/user.schema");
const mongoose_2 = require("@nestjs/mongoose");
const role_schema_1 = require("../../database/schemas/role.schema");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const json_response_model_1 = require("../admin/list-model/json-response.model");
const status_constants_1 = require("../../Constant/status.constants");
let AuthService = class AuthService {
    constructor(userModel, roleModel, jwtService) {
        this.userModel = userModel;
        this.roleModel = roleModel;
        this.jwtService = jwtService;
    }
    async loginUser(loginRes) {
        const jsonResponse = new json_response_model_1.JsonResponse();
        const user = await this.userModel.findOne({ email: loginRes.email }).exec();
        const authPassword = await this.comparePassword(loginRes.password, user.password);
        if (authPassword) {
            const token = await this.generateToken(user);
            jsonResponse.message = status_constants_1.MESSAGES_CODE.LOGIN_SUCCESS;
            jsonResponse.result = token;
            jsonResponse.success = true;
            return jsonResponse;
        }
    }
    async registerUser(registerRes) {
        const jsonResponse = new json_response_model_1.JsonResponse();
        if (registerRes === null) {
            jsonResponse.success = false;
            jsonResponse.message = 'User not created';
            jsonResponse.result = null;
            return jsonResponse;
        }
        const existingUser = await this.userModel
            .findOne({ email: registerRes.email })
            .exec();
        if (existingUser) {
            jsonResponse.success = false;
            jsonResponse.message = 'User already exists';
        }
        const user = new this.userModel();
        user._id = new mongoose_1.default.Types.ObjectId();
        user.email = registerRes.email.toString();
        user.firstName = registerRes.firstName;
        user.lastName = registerRes.lastName;
        user.phoneNumber = registerRes.phoneNumber;
        const role = await this.roleModel.findOne({ title: 'User' }).exec();
        user.roleId = role._id;
        user.registrationDate = new Date();
        user.subscription = false;
        const token = await this.hashPassword(registerRes.password);
        user.password = token;
        await this.userModel.create(user);
        jsonResponse.success = true;
        jsonResponse.message = 'User created successfully';
        jsonResponse.result = user;
        return jsonResponse;
    }
    async generateToken(user) {
        const roleId = await this.fetchRole(user.roleId);
        const payload = {
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            roleId: roleId,
            subscription: user.subscription,
            registrationDate: user.registrationDate,
            id: user._id,
        };
        return {
            access_token: this.jwtService.sign(payload),
            roleId: roleId,
            name: user.firstName + ' ' + user.lastName,
        };
    }
    async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }
    async comparePassword(password, storePasswordHash) {
        return await bcrypt.compare(password, storePasswordHash);
    }
    async fetchRole(user) {
        try {
            const role = await this.roleModel.findOne({ _id: user }).exec();
            return role.title;
        }
        catch (error) {
            throw new Error('Error fetching roles');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_2.InjectModel)(role_schema_1.Role.name)),
    __metadata("design:paramtypes", [mongoose_1.default.Model, mongoose_1.default.Model, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map