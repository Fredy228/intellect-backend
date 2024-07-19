import { ApiProperty } from '@nestjs/swagger';
import { ESupportMessagesStatus } from '../../enums/user/support-messages.enum';

export class SupportMessageDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  title: string;
}

export class UpdateSupportMessageDto {
  @ApiProperty()
  status: ESupportMessagesStatus;
}
