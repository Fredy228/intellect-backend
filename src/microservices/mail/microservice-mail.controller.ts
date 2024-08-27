import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { MicroserviceMailService } from './microservice-mail.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { SendEmailSchema } from '../../joi-schema/mail.schema';
import { MailForgotDto } from './mail.dto';

@Controller('api/mail')
@ApiTags('Mail service')
export class MailController {
  constructor(private readonly mailService: MicroserviceMailService) {}

  @ApiOperation({
    summary: 'Send message for restore pass',
  })
  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new BodyValidationPipe(SendEmailSchema))
  async sendForgotPass(@Body() body: MailForgotDto) {
    return this.mailService.sendRestorePassLink(body);
  }
}
