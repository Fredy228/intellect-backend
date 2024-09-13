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
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  PickType,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Profile, Student, User, RoleEnum } from 'lib-intellecta-entity';

import { RolesGuard } from '../../guard/role/roles.guard';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { Roles } from '../../guard/role/roles.decorator';
import {
  AddManyStudentDto,
  AddStudentDto,
  UpdateGroupStudentDto,
} from './student.dto';
import {
  studentChangeGroupSchema,
  studentManyCreateSchema,
  studentOneCreateSchema,
} from '../../joi-schema/student.schema';
import { parseQueryGetAll } from '../../services/generate-filter-list';
import { CreateManyResponse, GetAllStudentResponse } from './student.response';
import { FileValidatorPipe } from '../../pipe/validator-file.pipe';
import { CustomException } from '../../services/custom-exception';
import { ReqProtectedType } from '../../types/protect.type';
import { StudentService } from './student.service';

@ApiTags('Student')
@Controller('api/student')
@UseGuards(RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({
    summary: 'Create one student',
    description: 'Create one student in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Created student',
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
  @ApiConflictResponse({
    status: 409,
    description: 'User already exists in group',
  })
  @Post('/one/:idGroup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new BodyValidationPipe(studentOneCreateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async createOne(
    @Req() req: ReqProtectedType,
    @Body() body: AddStudentDto,
    @Param('idGroup') idGroup: string,
  ) {
    return this.studentService.createOne(req.user, body, Number(idGroup));
  }

  @ApiOperation({
    summary: 'Create many student',
    description: 'Create many student in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Created students',
    type: CreateManyResponse,
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
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 10 }]))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async createMany(
    @Req() req: ReqProtectedType,
    @Param('idUniversity') idUniversity: string,
    @Body() body: AddManyStudentDto,
    @UploadedFiles()
    files: {
      file?: Array<Express.Multer.File>;
    },
  ) {
    const { error, value } = studentManyCreateSchema.validate({
      groupId: JSON.parse(body.groupId),
    });
    if (error) {
      throw new CustomException(HttpStatus.BAD_REQUEST, error.message);
    }
    return this.studentService.createMany(req.user, files?.file, value.groupId);
  }

  @ApiOperation({
    summary: 'Get all student',
    description: 'Get all student in university',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'idGroup',
    required: false,
    description: 'ID Group',
  })
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
    description: 'Get all student',
    type: GetAllStudentResponse,
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
    @Query('idGroup') idGroup: string,
    @Query('range') range: string,
    @Query('filter') filter: string,
    @Query('sort') sort: string,
  ) {
    const query = parseQueryGetAll({ range, filter, sort });

    return this.studentService.getAll(
      Number(idUniversity),
      query,
      Number(idGroup),
    );
  }

  @ApiOperation({
    summary: 'Delete student',
    description: 'Delete student by id in university',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Deleted student',
    type: PickType(Profile, ['id', 'title', 'role']),
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Delete('/:idStudent')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async deleteById(
    @Req() req: ReqProtectedType,
    @Param('idStudent') idStudent: string,
  ) {
    return this.studentService.deleteById(req.user, Number(idStudent));
  }

  @ApiOperation({
    summary: 'Update student',
    description: 'Change group fro student in university',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Updated student',
    type: PickType(Student, ['id', 'title', 'role', 'group']),
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Patch('/:idStudent')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new BodyValidationPipe(studentChangeGroupSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async changeGroupById(
    @Req() req: ReqProtectedType,
    @Param('idStudent') idStudent: string,
    @Body() body: UpdateGroupStudentDto,
  ) {
    return this.studentService.changeGroupById(
      req.user,
      Number(idStudent),
      body,
    );
  }
}
