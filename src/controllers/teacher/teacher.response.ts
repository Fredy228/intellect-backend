import { ApiProperty, PickType } from '@nestjs/swagger';
import { Teacher } from 'lib-intellecta-entity';

export class GetAllTeacherResponse {
  @ApiProperty({
    description: 'Array all teacher',
    type: [PickType(Teacher, ['id', 'title', 'user'])],
  })
  data: Array<Pick<Teacher, 'id' | 'title' | 'user'>>;

  @ApiProperty({
    type: Number,
    nullable: false,
    description: 'Count of teachers',
  })
  total: number;
}

class ObjectCreateTeacherResponse {
  @ApiProperty({
    type: String,
    required: true,
    example: 'Message of response',
  })
  message: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'user@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  number: number;
}

export class CreateManyResponseTeacher {
  @ApiProperty({
    type: [ObjectCreateTeacherResponse],
  })
  data: [ObjectCreateTeacherResponse];

  @ApiProperty({
    type: [ObjectCreateTeacherResponse],
  })
  error: [ObjectCreateTeacherResponse];
}
