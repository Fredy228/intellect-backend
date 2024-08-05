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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleEnum, SupportMessage } from 'lib-intellecta-entity';

import { RolesGuard } from '../../guard/role/roles.guard';
import { SupportMessageService } from './support-message.service';
import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { Roles } from '../../guard/role/roles.decorator';
import {
  supportMessageCreateSchema,
  supportMessageUpdateSchema,
} from '../../joi-schema/support-messageSchema';
import { ReqProtectedType } from '../../types/protect.type';
import {
  SupportMessageDto,
  UpdateSupportMessageDto,
} from './support-message.dto';
import { parseQueryGetAll } from '../../services/generate-filter-list';
import { GetAllSupportMessagesResponse } from './support-message.response';

@ApiTags('Support')
@Controller('api/support-message')
@UseGuards(RolesGuard)
export class SupportMessageController {
  constructor(private readonly supportMessageService: SupportMessageService) {}

  @ApiOperation({
    summary: 'Create support message',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Created support message',
    type: SupportMessage,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new BodyValidationPipe(supportMessageCreateSchema))
  @Roles()
  async create(@Req() req: ReqProtectedType, @Body() body: SupportMessageDto) {
    return this.supportMessageService.create(req.user, body);
  }

  @ApiOperation({
    summary: 'Get all support messages',
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
    description: 'Get all support messages',
    type: GetAllSupportMessagesResponse,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.MAKER)
  async getAll(
    @Req() req: ReqProtectedType,
    @Query('range') range: string,
    @Query('filter') filter: string,
    @Query('sort') sort: string,
  ) {
    const query = parseQueryGetAll({ range, filter, sort });

    return this.supportMessageService.getAll(query);
  }

  @ApiOperation({
    summary: 'Get support messages by ID',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Get one support messages by ID',
    type: SupportMessage,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.MAKER)
  async getOneById(@Param('id') id: string) {
    return this.supportMessageService.getOne(Number(id));
  }

  @ApiOperation({
    summary: 'Update support message',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    status: 201,
    description: 'Update support message',
    type: SupportMessage,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Invalid token or not found',
  })
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new BodyValidationPipe(supportMessageUpdateSchema))
  @Roles(RoleEnum.MAKER)
  async update(@Param('id') id: string, @Body() body: UpdateSupportMessageDto) {
    return this.supportMessageService.update(Number(id), body);
  }
}
