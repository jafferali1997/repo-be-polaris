import { PERMISSIONS_TYPE } from '@/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UserName {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  profileUrl: string;
}
