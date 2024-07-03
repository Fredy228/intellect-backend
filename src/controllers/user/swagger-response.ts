import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../entity/user/user.entity';
import { Profile } from '../../entity/user/proflle.entity';

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
