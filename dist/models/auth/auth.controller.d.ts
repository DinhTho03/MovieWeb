import { AuthService } from './auth.service';
import { RegisterRes } from './dto/registerRes.dto';
import { LoginRes } from './dto/loginRes.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    Login(loginRes: LoginRes): Promise<any>;
    Register(user: RegisterRes): Promise<any>;
    test(req: any): Promise<any>;
}
