import { RegisterRes } from './dto/registerRes.dto';
import mongoose from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import { Role } from 'src/database/schemas/role.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginRes } from './dto/loginRes.dto';
export interface IAuthService {
    loginUser(loginRes: LoginRes): Promise<any>;
    registerUser(RegisterRes: RegisterRes): Promise<any>;
}
export declare class AuthService implements IAuthService {
    private userModel;
    private roleModel;
    private readonly jwtService;
    constructor(userModel: mongoose.Model<User>, roleModel: mongoose.Model<Role>, jwtService: JwtService);
    loginUser(loginRes: LoginRes): Promise<any>;
    registerUser(registerRes: RegisterRes): Promise<any>;
    generateToken(user: User): Promise<any>;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, storePasswordHash: string): Promise<any>;
    private fetchRole;
}
