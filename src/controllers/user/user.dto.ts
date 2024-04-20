import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from 'libphonenumber-js/types';

export class UserDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  phone: {
    country: CountryCode;
    number: string;
  };

  @ApiProperty()
  birthday: Date;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  sex: 0 | 1;
}
