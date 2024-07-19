import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import {
  universityCreateSchema,
  universityUpdateSchema,
} from '../../joi-schema/universitySchema';
import { University } from '../../entity/university/university.entity';
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
}
