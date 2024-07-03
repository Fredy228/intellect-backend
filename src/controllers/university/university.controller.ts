import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../../guard/role/roles.guard';
import { Roles } from '../../guard/role/roles.decorator';
import { RoleEnum } from '../../enums/user/role-enum';
import { UniversityService } from './university.service';
import { UniversityCreateDto, UniversityUpdateDto } from './university.dto';
import { User } from '../../entity/user/user.entity';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import {
  universityCreateSchema,
  universityUpdateSchema,
} from '../../joi-schema/universitySchema';
import { UserAndProfileResponse } from '../user/swagger-response';

@ApiTags('University')
@Controller('api/university')
@UseGuards(RolesGuard)
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @ApiOperation({
    summary: 'Update university',
    description: 'Owner and moderator can update university',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Update university successfully',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Patch('/:idUniversity')
  @HttpCode(200)
  @UsePipes(new BodyValidationPipe(universityUpdateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async updateInfo(
    @Req() req: Request & { user: User },
    @Param('idUniversity') idUniversity: string,
    @Body() body: UniversityUpdateDto,
  ) {
    return this.universityService.updateInfo(
      req.user,
      Number(idUniversity),
      body,
    );
  }

  @Post('/')
  @HttpCode(201)
  @UsePipes(new BodyValidationPipe(universityCreateSchema))
  @Roles()
  async createNewUniversity(
    @Req() req: Request & { user: User },
    @Body() body: UniversityCreateDto,
  ) {
    return this.universityService.createNewUniversity(req.user, body);
  }
}
