import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../../guard/role/roles.guard';
import { Group } from '../../entity/group/group.entity';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { Roles } from '../../guard/role/roles.decorator';
import { RoleEnum } from '../../enums/user/role-enum';
import { User } from '../../entity/user/user.entity';
import { AddStudentDto } from './student.dto';
import { studentOneCreateSchema } from '../../joi-schema/studentSchema';

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
    type: Group,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'User already exists in group',
  })
  @Post('/one/:idUniversity')
  @HttpCode(201)
  @UsePipes(new BodyValidationPipe(studentOneCreateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async createOne(
    @Req() req: Request & { user: User },
    @Body() body: AddStudentDto,
    @Param('idUniversity') idUniversity: string,
    @Query('idGroup') idGroup?: string,
  ) {
    return this.studentService.createOne(
      req.user,
      Number(idUniversity),
      body,
      Number(idGroup),
    );
  }
}
