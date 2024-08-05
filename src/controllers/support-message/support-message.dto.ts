import { ApiProperty } from '@nestjs/swagger';
import { ESupportMessagesStatus } from 'lib-intellecta-entity';

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
