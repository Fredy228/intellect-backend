import { ApiProperty } from '@nestjs/swagger';

export class AddStudentDto {
  @ApiProperty()
  email: string;
}

export class AddManyStudentDto {
  @ApiProperty({
    description: '[1, 2, 3, 4, 5]',
    type: Array<number>,
  })
  groupId: string;
}

export class UpdateGroupStudentDto {
  @ApiProperty({
    type: Number,
  })
  groupId: number;
}
