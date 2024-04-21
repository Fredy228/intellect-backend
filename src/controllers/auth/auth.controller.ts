import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import AuthGoogle from './google.guard';
import * as process from 'process';
import { ApiOperation, ApiResponse, ApiTags, OmitType } from '@nestjs/swagger';

dotenv.config();

import { LoginAuthDto, RegisterAuthDto, TokenDto } from './auth.dto';
import { AuthService } from './auth.service';

import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { userCreateSchema } from '../../joi-schema/userSchema';
import { User, UserDevices } from '../../entity/user/user.entity';

const CLIENT_URL = process.env.CLIENT_URL;
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

@Controller('api/auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register user', description: 'Return user' })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: OmitType(User, ['password', 'devices']),
  })
  @ApiResponse({ status: 401, description: 'Such a user already exists' })
  @HttpCode(201)
  @UsePipes(new BodyValidationPipe(userCreateSchema))
  async register(
    @Req()
    req: Request,
    @Body() registerBody: RegisterAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const userAgent = req['useragent'];
    const createdUser = await this.authService.signUpCredentials({
      ...registerBody,
      userAgent,
    });
    res.cookie('refreshToken', createdUser.refreshToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    return createdUser;
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user', description: 'Return user' })
  @ApiResponse({
    status: 200,
    description: 'User authorized',
    type: OmitType(User, ['password', 'devices']),
  })
  @ApiResponse({ status: 401, description: 'Username or password is wrong' })
  @HttpCode(200)
  async login(
    @Req()
    req: Request,
    @Body() loginBody: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req['useragent'];
    const foundUser = await this.authService.signInCredentials({
      ...loginBody,
      userAgent,
    });
    res.cookie('refreshToken', foundUser.refreshToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    return foundUser;
  }

  @Get('google')
  @ApiOperation({
    summary: 'Login user with Google',
    description: 'Start user authorization',
  })
  @HttpCode(200)
  @UseGuards(AuthGoogle)
  googleLogin() {
    return;
  }

  @Get('google/callback')
  @ApiOperation({
    summary: 'Login user with Google',
    description: 'Continue user authorized and Redirect',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect',
  })
  @HttpCode(302)
  @UseGuards(AuthGoogle)
  async googleLoginCallback(
    @Req()
    req: Request & {
      user: Pick<User, 'firstName' | 'lastName' | 'image' | 'email'>;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req['useragent'];
    const foundUser = await this.authService.authGoogle(req.user, userAgent);

    res.cookie('refreshToken', foundUser.refreshToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    res.redirect(`${CLIENT_URL}/dashboard?token=${foundUser.accessToken}`);
  }

  @Get('/refresh')
  @ApiOperation({ summary: 'Refresh tokens', description: 'Return tokens' })
  @ApiResponse({
    status: 200,
    description: 'User refreshed token',
    type: TokenDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid token or not found' })
  @HttpCode(200)
  async refreshToken(
    @Req()
    req: Request & {
      user: User;
      currentDevice: UserDevices;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    // const userAgent = req['useragent'];

    const tokens = await this.authService.refreshToken(
      req.user,
      req.currentDevice,
      // userAgent,
    );
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: MAX_AGE,
    });
    return tokens;
  }

  @Get('/logout')
  @ApiOperation({ summary: 'Logout user', description: 'Return null' })
  @ApiResponse({ status: 204, description: 'User logout' })
  @ApiResponse({ status: 401, description: 'Invalid token or not found' })
  @HttpCode(204)
  async logOut(
    @Req() req: Request & { user: User; currentDevice: UserDevices },
  ) {
    return this.authService.logout(req.currentDevice);
  }
}
