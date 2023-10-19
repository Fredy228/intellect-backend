import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './auth.service';
import { LoginAuthDto } from './auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginBody: LoginAuthDto) {
    return this.userService.singIn(loginBody);
  }
}
