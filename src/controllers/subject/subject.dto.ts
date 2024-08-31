import { ApiProperty } from '@nestjs/swagger';

export class SubjectDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  short_name?: string;

  @ApiProperty()
  icon_name: string;
}
