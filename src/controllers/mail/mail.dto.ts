import { ApiProperty } from '@nestjs/swagger';

export class MailForgotDto {
  @ApiProperty()
  email: string;
}
