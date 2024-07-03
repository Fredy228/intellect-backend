import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from 'libphonenumber-js/types';

export class UniversityUpdateDto {
  @ApiProperty()
  university_name?: string;

  @ApiProperty()
  university_short_name?: string;

  @ApiProperty()
  registration_year?: number;

  @ApiProperty()
  post_index_u?: string;

  @ApiProperty()
  university_site?: string;

  @ApiProperty()
  contacts?: Array<{
    title: string;
    country: CountryCode;
    number: string;
  }>;
}

export class UniversityCreateDto {
  @ApiProperty()
  university_name: string;

  @ApiProperty()
  university_short_name: string;
}
