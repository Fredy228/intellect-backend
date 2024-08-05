import { ApiProperty, PickType } from '@nestjs/swagger';
import { User, Profile } from 'lib-intellecta-entity';

export class UserAndProfileResponse {
  @ApiProperty({ type: [Profile] })
  profiles: Profile[];

  @ApiProperty({
    type: PickType(User, [
      'id',
      'firstName',
      'lastName',
      'image',
      'email',
      'verified',
      'settings',
    ]),
  })
  user: User;
}
