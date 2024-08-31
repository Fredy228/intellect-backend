import { ApiProperty } from '@nestjs/swagger';

export class AddTeacherDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  job_title: string;
}

export class UpdateTeacherDto {
  @ApiProperty()
  job_title: string;
}
