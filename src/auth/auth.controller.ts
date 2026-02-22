import { Body, Controller, Post, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Public } from "../common/decorators/public.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UserRole } from "@prisma/client";
import { Roles } from "src/common/decorators/roles.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("register/admin")
  @Roles(UserRole.SUPER_ADMIN)
  registerAdmin(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("register")
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  getProfile(@CurrentUser() user: any) {
    return user;
  }
}
