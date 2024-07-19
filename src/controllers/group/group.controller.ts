import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { RolesGuard } from '../../guard/role/roles.guard';
import { RoleEnum } from '../../enums/user/role-enum';
import { Roles } from '../../guard/role/roles.decorator';
import { User } from '../../entity/user/user.entity';
import { GroupDto } from './group.dto';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import {
  groupCreateSchema,
  groupUpdateSchema,
} from '../../joi-schema/groupSchema';
import { UserAndProfileResponse } from '../user/swagger-response';
import { Group } from '../../entity/group/group.entity';
import { ReqProtectedType } from '../../types/protect.type';

@ApiTags('Group')
@Controller('api/group')
@UseGuards(RolesGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({
    summary: 'Create group',
    description: 'Create group in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Created group',
    type: Group,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Post('/:idUniversity')
  @HttpCode(201)
  @UsePipes(new BodyValidationPipe(groupCreateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async create(
    @Req() req: ReqProtectedType,
    @Body() body: GroupDto,
    @Param('idUniversity') idUniversity: string,
  ) {
    return this.groupService.create(req.user, body, Number(idUniversity));
  }

  @ApiOperation({
    summary: 'Update group',
    description: 'Update group in university',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 200,
    description: 'Updated group',
    type: Group,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Patch('/:idGroup')
  @HttpCode(200)
  @UsePipes(new BodyValidationPipe(groupUpdateSchema))
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async update(
    @Req() req: ReqProtectedType,
    @Body() body: Partial<GroupDto>,
    @Param('idGroup') idGroup: string,
  ) {
    return this.groupService.update(req.user, Number(idGroup), body);
  }

  @ApiOperation({
    summary: 'Get groups',
    description: 'Get all groups in university',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Got all groups in university',
    type: [OmitType(Group, ['createAt', 'updateAt'])],
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Get('/:idUniversity')
  @HttpCode(200)
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async getAllGroups(
    @Req() req: ReqProtectedType,
    @Param('idUniversity') idUniversity: string,
  ) {
    return this.groupService.getAll(req.user, Number(idUniversity));
  }

  @ApiOperation({
    summary: 'Get group',
    description: 'Get group by ID',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Got group in university',
    type: OmitType(Group, ['createAt', 'updateAt']),
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Get('/id/:idGroup')
  @HttpCode(200)
  @Roles()
  async getByIdGroup(@Param('idGroup') idUniversity: string) {
    return this.groupService.getById(Number(idUniversity));
  }

  @ApiOperation({
    summary: 'Delete group',
    description: 'Delete group by id',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: "You'll get a deleted group",
    type: PickType(Group, ['id', 'name', 'level']),
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Delete('/:idGroup')
  @HttpCode(200)
  @Roles(RoleEnum.MODER_UNIVERSITY, RoleEnum.OWNER_UNIVERSITY)
  async delete(
    @Req() req: ReqProtectedType,
    @Param('idGroup') idGroup: string,
  ) {
    return this.groupService.delete(req.user, Number(idGroup));
  }
}
