import { Injectable } from '@nestjs/common';
import { RegisterRes } from './dto/registerRes.dto';
import mongoose from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from 'src/database/schemas/role.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthPayload } from './dto/auth-payload.interface';
import { JsonResponse } from '../admin/list-model/json-response.model';
import { LoginRes } from './dto/loginRes.dto';

export interface IAuthService {
  loginUser(loginRes: LoginRes): Promise<any>;
  registerUser(RegisterRes: RegisterRes): Promise<any>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    @InjectModel(Role.name)
    private roleModel: mongoose.Model<Role>,
    private readonly jwtService: JwtService,
  ) {}
  async loginUser(loginRes: LoginRes): Promise<any> {
    const user = await this.userModel.findOne({ email: loginRes.email }).exec();
    console.log(typeof user.email);
    console.log(user);
    const authPassword = await this.comparePassword(
      loginRes.password,
      user.password,
    );
    if (authPassword) {
      const token = await this.generateToken(user);
      return token;
    }
  }
  async registerUser(registerRes: RegisterRes): Promise<any> {
    const jsonResponse = new JsonResponse();
    if (registerRes === null) {
      jsonResponse.success = false;
      jsonResponse.message = 'User not created';
      jsonResponse.result = null;
      return jsonResponse;
    }
    const user = new this.userModel();
    user._id = new mongoose.Types.ObjectId();
    user.email = registerRes.email.toString();
    // user.password = registerRes.password;
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

  async generateToken(user: User): Promise<any> {
    const roleId = await this.fetchRole(user.roleId);
    const payload: AuthPayload = {
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      roleId: roleId,
      subscription: user.subscription,
      registrationDate: user.registrationDate,
      id: user._id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
  async comparePassword(
    password: string,
    storePasswordHash: string,
  ): Promise<any> {
    return await bcrypt.compare(password, storePasswordHash);
  }

  private async fetchRole(user: string): Promise<string> {
    // Assume that you have a "Favorites" model/schema defined in your application
    // and a corresponding collection in MongoDB
    try {
      const role = await this.roleModel.findOne({ _id: user }).exec();
      return role.title;
    } catch (error) {
      // Handle any errors that might occur during the database query
      throw new Error('Error fetching roles');
    }
  }
}
