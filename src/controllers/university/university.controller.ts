import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  PickType,
} from '@nestjs/swagger';
import { User, RoleEnum, University } from 'lib-intellecta-entity';

import { RolesGuard } from '../../guard/role/roles.guard';
import { Roles } from '../../guard/role/roles.decorator';
import { UniversityService } from './university.service';
import {
  ModeratorCreateDto,
  UniversityCreateDto,
  UniversityUpdateDto,
} from './university.dto';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import {
  AdminOneCreateSchema,
  universityCreateSchema,
  universityUpdateSchema,
} from '../../joi-schema/university.schema';
import { ReqProtectedType } from '../../types/protect.type';

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
    @Req() req: ReqProtectedType,
    @Param('idUniversity') idUniversity: string,
    @Body() body: UniversityUpdateDto,
  ) {
    return this.universityService.updateInfo(
      req.user,
      Number(idUniversity),
      body,
    );
  }

  @ApiOperation({
    summary: 'Get profile university',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Get profile university successfully',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Get('/:idUniversity')
  @HttpCode(200)
  @Roles()
  async getProfile(
    @Param('idUniversity') idUniversity: string,
  ): Promise<University> {
    return this.universityService.getProfileUni(Number(idUniversity));
  }

  @ApiOperation({
    summary: 'Create university manually',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Created university successfully',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Post('/')
  @HttpCode(201)
  @UsePipes(new BodyValidationPipe(universityCreateSchema))
  @Roles(RoleEnum.MAKER)
  async createNewUniversity(
    @Req() req: ReqProtectedType,
    @Body() body: UniversityCreateDto,
    @Query('id') idUser: string,
  ) {
    return this.universityService.createNewUniversity(Number(idUser), body);
  }

  @Post('/edbo/university/:edbo')
  @HttpCode(201)
  @Roles(RoleEnum.MAKER)
  async createUniversityByEdbo(
    @Req() req: ReqProtectedType,
    @Query('id') idUser: string,
    @Param('edbo') edbo: string,
  ) {
    return this.universityService.createUniversityEdbo(
      Number(idUser),
      Number(edbo),
    );
  }

  // @Post('/edbo/school/:edbo')
  // @HttpCode(201)
  // @Roles(RoleEnum.MAKER)
  // async createSchoolByEdbo(@Req() req: ReqProtectedType) {}

  @ApiOperation({
    summary: 'Create one moderator',
    description: 'Create one moderator in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Created moderator',
    type: PickType(User, [
      'id',
      'firstName',
      'lastName',
      'sex',
      'middleName',
      'email',
    ]),
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Post('/admin/:idUniversity')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new BodyValidationPipe(AdminOneCreateSchema))
  @Roles(RoleEnum.OWNER_UNIVERSITY)
  async createAdmin(
    @Req() req: ReqProtectedType,
    @Body() body: ModeratorCreateDto,
    @Param('idUniversity') idUniversity: string,
  ) {
    return this.universityService.createModerator(
      req.user,
      Number(idUniversity),
      body,
    );
  }
}
