import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from '../../entity/user/user.entity';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { userUpdateSchema } from '../../joi-schema/userSchema';

@Controller('api/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get user', description: 'Return user' })
  @ApiResponse({
    status: 200,
    description: 'User got',
    type: OmitType(User, ['password', 'devices']),
  })
  @ApiResponse({ status: 401, description: 'Invalid token or not found' })
  @HttpCode(200)
  async getMe(@Req() req: Request & { user: User }) {
    return this.userService.getUser(req.user);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Get user', description: 'Return user' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: PickType(User, [
      'id',
      'email',
      'firstName',
      'lastName',
      'middleName',
      'phone',
      'sex',
      'birthday',
      'bio',
    ]),
  })
  @ApiResponse({ status: 401, description: 'Invalid token or not found' })
  @HttpCode(200)
  async getMyUserProfile(@Req() req: Request & { user: User }) {
    return this.userService.getMyUserProfile(req.user);
  }

  @Patch('/')
  @ApiOperation({
    summary: 'Update user personal info',
    description: 'Return null',
  })
  @ApiResponse({
    status: 204,
    description: 'Updated user',
    type: PartialType(UserDto),
  })
  @HttpCode(204)
  @UsePipes(new BodyValidationPipe(userUpdateSchema))
  async updateMePersonalInfo(
    @Req() req: Request & { user: User },
    @Body() body: Partial<UserDto>,
  ): Promise<void> {
    return this.userService.updateUserPersonalInfo(req.user, body);
  }
}
