import { PERMISSIONS_TYPE } from '@/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserName {
  @ApiProperty()
  @IsString()
  name: string;
}
