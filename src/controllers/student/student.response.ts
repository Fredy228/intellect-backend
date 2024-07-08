import { ApiProperty, PickType } from '@nestjs/swagger';
import { Student } from '../../entity/user/student.entity';

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
  @ApiProperty({})
  message: string;

  @ApiProperty({})
  email: string;

  @ApiProperty({})
  number: number;
}

class DataCreateStudentResponse {
  @ApiProperty({
    type: [ObjectCreateStudentResponse],
  })
  group_id: [ObjectCreateStudentResponse];
}

export class CreateManyResponse {
  @ApiProperty()
  data: DataCreateStudentResponse;

  @ApiProperty()
  error: DataCreateStudentResponse;
}
