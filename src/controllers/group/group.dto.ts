import { ApiProperty } from '@nestjs/swagger';

export class GroupDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  start_date: Date;

  @ApiProperty()
  end_date: Date;
}
