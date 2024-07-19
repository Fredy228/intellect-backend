import { ApiProperty } from '@nestjs/swagger';
import { SupportMessage } from '../../entity/support-message.entity';

export class GetAllSupportMessagesResponse {
  @ApiProperty({
    description: 'Array all support messages',
    type: [SupportMessage],
  })
  data: Array<SupportMessage>;

  @ApiProperty({
    type: Number,
    nullable: false,
    description: 'Count of support messages',
  })
  total: number;
}
