import { ApiProperty } from '@nestjs/swagger';
import { Subject } from 'lib-intellecta-entity';

export class GetAllSubjectResponse {
  @ApiProperty({
    description: 'Array all subjects',
    type: [Subject],
  })
  data: Array<Subject>;

  @ApiProperty({
    type: Number,
    nullable: false,
    description: 'Count of subjects',
  })
  total: number;
}
