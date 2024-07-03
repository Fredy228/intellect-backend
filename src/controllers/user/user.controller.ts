import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Req,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { User } from '../../entity/user/user.entity';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  PickType,
} from '@nestjs/swagger';
import { UserUpdateDto } from './user.dto';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { userUpdateSchema } from '../../joi-schema/userSchema';
import { Profile } from '../../entity/user/proflle.entity';
import { UserAndProfileResponse } from './swagger-response';

@Controller('api/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get user', description: 'Return user' })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'User and Profiles got',
    type: UserAndProfileResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @HttpCode(200)
  async getMe(@Req() req: Request & { user: User }): Promise<{
    user: User;
    profiles: Profile[];
  }> {
    return this.userService.getUser(req.user);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Get user', description: 'Return user' })
  @ApiBearerAuth()
  @ApiOkResponse({
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
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @HttpCode(200)
  async getMyUserProfile(@Req() req: Request & { user: User }) {
    return this.userService.getMyUserProfile(req.user);
  }

  @Patch('/')
  @ApiOperation({
    summary: 'Update user personal info',
    description: 'Return null',
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    status: 204,
    description: 'Updated user',
  })
  @HttpCode(204)
  @UsePipes(new BodyValidationPipe(userUpdateSchema))
  async updateMePersonalInfo(
    @Req() req: Request & { user: User },
    @Body() body: UserUpdateDto,
  ): Promise<void> {
    return this.userService.updateUserPersonalInfo(req.user, body);
  }
}
