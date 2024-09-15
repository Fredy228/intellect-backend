import { ApiProperty, PickType } from '@nestjs/swagger';
import { Student } from 'lib-intellecta-entity';

export class GetAllStudentResponse {
  @ApiProperty({
    description: 'Array all student',
    type: [PickType(Student, ['id', 'title', 'user'])],
  })
  data: Array<Pick<Student, 'id' | 'title' | 'user'>>;

  @ApiProperty({
    type: Number,
    nullable: false,
    description: 'Count of students',
  })
  total: number;
}

class ObjectCreateStudentResponse {
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

class DataCreateStudentResponse {
  @ApiProperty({
    type: [ObjectCreateStudentResponse],
  })
  group_id: [ObjectCreateStudentResponse];
}

export class CreateManyResponseStudent {
  @ApiProperty()
  data: DataCreateStudentResponse;

  @ApiProperty()
  error: DataCreateStudentResponse;
}
