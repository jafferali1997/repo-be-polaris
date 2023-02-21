import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UserFilter {
  @ApiProperty()
  @IsString()
  search: string;
}
