import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SupportMessage } from 'lib-intellecta-entity';

import { BodyValidationPipe } from '../../pipe/validator-body.pipe';
import { SendEmailSchema } from '../../joi-schema/mailSchema';
import { MailForgotDto } from './mail.dto';

@Controller('api/mail')
@ApiTags('Mail service')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({
    summary: 'Send message for restore pass',
  })
  @Post('/forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new BodyValidationPipe(SendEmailSchema))
  async sendForgotPass(@Body() { email }: MailForgotDto) {
    return this.mailService.sendRestorePassLink(email);
  }
}
