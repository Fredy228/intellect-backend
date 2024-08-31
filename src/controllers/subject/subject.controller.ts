import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { Group, RoleEnum, Subject } from 'lib-intellecta-entity';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { Roles } from '../../guard/role/roles.decorator';
import { ReqProtectedType } from '../../types/protect.type';
import { SubjectDto } from './subject.dto';
import {
  subjectCreateSchema,
  subjectUpdateSchema,
} from '../../joi-schema/subject.schema';
import { parseQueryGetAll } from '../../services/generate-filter-list';
import { GetAllSubjectResponse } from './subject.response';
import { groupUpdateSchema } from '../../joi-schema/group.schema';
import { GroupDto } from '../group/group.dto';

@ApiTags('Subject')
@Controller('api/subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({
    summary: 'Create subject',
    description: 'Create subject in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Created subject',
    type: Subject,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Post('/one/:idUniversity')
  @HttpCode(201)
  @UsePipes(new BodyValidationPipe(subjectCreateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async create(
    @Req() { user }: ReqProtectedType,
    @Body() body: SubjectDto,
    @Param('idUniversity') idUniversity: string,
  ) {
    return this.subjectService.create(Number(idUniversity), body, user);
  }

  @ApiOperation({
    summary: 'Get subjects',
    description: 'Get all subjects in university',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'range',
    required: false,
    description: 'Range. [1, 20]',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter by fields. { [name_field: string]: value }',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Sort by fields. [field, "ASC"] (ASC | DESC)',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Got all subjects in university',
    type: GetAllSubjectResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Get('/:idUniversity')
  @HttpCode(200)
  @Roles()
  async getAllSubjects(
    @Req() req: ReqProtectedType,
    @Param('idUniversity') idUniversity: string,
    @Query('range') range: string,
    @Query('filter') filter: string,
    @Query('sort') sort: string,
  ) {
    const query = parseQueryGetAll({ range, filter, sort });
    return this.subjectService.getAll(Number(idUniversity), query);
  }

  @ApiOperation({
    summary: 'Get subject',
    description: 'Get subject by ID',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Got subject in university',
    type: Subject,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Get('/id/:idSubject')
  @HttpCode(200)
  @Roles()
  async getByIdSubject(@Param('idSubject') idSubject: string) {
    return this.subjectService.getById(Number(idSubject));
  }

  @ApiOperation({
    summary: 'Update subject',
    description: 'Update subject in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 200,
    description: 'Updated subject',
    type: Group,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Patch('/:idSubject')
  @HttpCode(200)
  @UsePipes(new BodyValidationPipe(subjectUpdateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async update(
    @Req() { user }: ReqProtectedType,
    @Body() body: Partial<SubjectDto>,
    @Param('idSubject') idSubject: string,
  ) {
    return this.subjectService.update(Number(idSubject), body, user);
  }

  @ApiOperation({
    summary: 'Delete subject',
    description: 'Delete subject by id',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: "You'll get a deleted subject",
    type: Subject,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Delete('/:idSubject')
  @HttpCode(200)
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async delete(
    @Req() { user }: ReqProtectedType,
    @Param('idSubject') idSubject: string,
  ) {
    return this.subjectService.deleteById(Number(idSubject), user);
  }
}
