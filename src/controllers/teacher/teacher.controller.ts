import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  PickType,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User, Profile, RoleEnum, Group, Teacher } from 'lib-intellecta-entity';

import { RolesGuard } from '../../guard/role/roles.guard';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { Roles } from '../../guard/role/roles.decorator';
import { AddTeacherDto, UpdateTeacherDto } from './teacher.dto';
import {
  teacherOneCreateSchema,
  teacherUpdateSchema,
} from '../../joi-schema/teacher.schema';
import { FileValidatorPipe } from '../../pipe/validator-file.pipe';
import { parseQueryGetAll } from '../../services/generate-filter-list';
import { ReqProtectedType } from '../../types/protect.type';
import {
  CreateManyResponseTeacher,
  GetAllTeacherResponse,
} from './teacher.response';

@ApiTags('Teacher')
@Controller('api/teacher')
@UseGuards(RolesGuard)
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @ApiOperation({
    summary: 'Create one teacher',
    description: 'Create one teacher in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Created teacher',
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
  @Post('/one/:idUniversity')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new BodyValidationPipe(teacherOneCreateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async createOne(
    @Req() req: ReqProtectedType,
    @Body() body: AddTeacherDto,
    @Param('idUniversity') idUniversity: string,
  ) {
    return this.teacherService.createOne(req.user, Number(idUniversity), body);
  }

  @ApiOperation({
    summary: 'Create many teacher',
    description: 'Create many teacher in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Created teachers',
    type: CreateManyResponseTeacher,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Post('/many/:idUniversity')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(
    new FileValidatorPipe({
      maxSize: 10,
      nullable: false,
      mimetype: 'application',
      type: [
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'vnd.ms-excel',
        'zip',
      ],
    }),
  )
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async createMany(
    @Req() req: ReqProtectedType,
    @Param('idUniversity') idUniversity: string,
    @UploadedFiles()
    files: {
      file?: Array<Express.Multer.File>;
    },
  ) {
    return this.teacherService.createMany(
      req.user,
      files?.file[0],
      Number(idUniversity),
    );
  }

  @ApiOperation({
    summary: 'Get all teacher',
    description: 'Get all teacher in university',
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
    description: 'Get all teacher',
    type: GetAllTeacherResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Get('/:idUniversity')
  @HttpCode(HttpStatus.OK)
  @Roles()
  async getAll(
    @Req() req: ReqProtectedType,
    @Param('idUniversity') idUniversity: string,
    @Query('range') range: string,
    @Query('filter') filter: string,
    @Query('sort') sort: string,
  ) {
    const query = parseQueryGetAll({ range, filter, sort });

    return this.teacherService.getAll(Number(idUniversity), query);
  }

  @ApiOperation({
    summary: 'Update teacher',
    description: 'Update teacher in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 200,
    description: 'Updated teacher',
    type: Teacher,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Patch('/:idTeacher')
  @HttpCode(200)
  @UsePipes(new BodyValidationPipe(teacherUpdateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async update(
    @Req() { user }: ReqProtectedType,
    @Body() body: Partial<UpdateTeacherDto>,
    @Param('idTeacher') idTeacher: string,
  ) {
    return this.teacherService.update(user, Number(idTeacher), body);
  }

  @ApiOperation({
    summary: 'Delete teacher',
    description: 'Delete teacher by id in university',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Deleted teacher',
    type: PickType(Profile, ['id', 'title', 'role']),
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Delete('/:idTeacher')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async deleteById(
    @Req() req: ReqProtectedType,
    @Param('idTeacher') idTeacher: string,
  ) {
    return this.teacherService.deleteById(req.user, Number(idTeacher));
  }
}
