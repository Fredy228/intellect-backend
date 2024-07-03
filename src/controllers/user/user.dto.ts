import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from 'libphonenumber-js/types';

export class PhoneNumberDto {
  @ApiProperty()
  country: CountryCode;

  @ApiProperty()
  number: string;
}

export class UserUpdateDto {
  @ApiProperty()
  firstName?: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  middleName?: string;

  @ApiProperty()
  phone?: PhoneNumberDto;

  @ApiProperty()
  birthday?: Date;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  sex?: 0 | 1;
}
