import { PERMISSIONS_TYPE } from '@/constants';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UserToUpdate {
  @ApiProperty()
  @IsString()
  status: PERMISSIONS_TYPE;
}
